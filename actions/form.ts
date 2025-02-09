'use server';
import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schema/form";
import { currentUser } from "@clerk/nextjs/server";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
    const user = await currentUser();
    if(!user) {
        return {
            error: "no user",
            visits: "",
            submissions: "",
            submissionRate: 0,
            bounceRate: 0
        }
    }

    const stats = await prisma.form.aggregate({
        where: {
            userId: user.id,
        },
        _sum: {
            visits: true,
            submissions: true,
        }
    });

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;

    let submissionRate = 0;
    if (visits > 0) {
        submissionRate = (submissions / visits ) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate,
        error: ""
    };
}

export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data);
    if(!validation.success) {
        throw new Error("form not valid");
    }

    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    const form = await prisma.form.create({
        data: {
            name: data.name,
            description: data.description,
            userId: user.id,
        }
    });

    if(!form) {
        throw new Error("error while creating form");
    }

    return form.id;
}

export async function GetForms() {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

export async function GetFormById(id: number) {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        },
    });
}

export async function UpdateFormContent(id: number, jsonContent: string) {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            content: jsonContent
        }
    });
}

export async function PublishForm(id: number) {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        where: {
            userId: user.id,
            id
        },
        data: {
            published: true
        }
    });
}

export async function GetFormContentByUrl(formUrl: string) {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        where: {
            shareURL: formUrl
        },
        select: {
            content: true
        },
        data: {
            visits: {
                increment: 1
            }
        }
    });
}

export async function SubmitForm(formURL: string, content: string) {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.update({
        where: {
            shareURL: formURL,
            published: true
        },
        data: {
            submissions: {
                increment: 1
            },
            FormSubmissions: {
                create: {
                    content
                }
            }
        }
    });
}

export async function GetFormWithSubmissions(id: number) {
    const user = await currentUser();
    if(!user) {
        throw new UserNotFoundErr();
    }

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        },
        include: {
            FormSubmissions: true
        }
    });
}
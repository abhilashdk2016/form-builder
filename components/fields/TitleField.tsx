"use client";

import { LuHeading1 } from "react-icons/lu";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";

const type: ElementsType = "TitleField";
const extraAttributes = {
    title: "Title field"
};
const propertiesSchema = z.object({
    title: z.string().min(2).max(50)
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const DesignerComponent = ({ elementInstance } : { elementInstance: FormElementInstance }) => {
    const element = elementInstance as CustomInstance;
    const { title } = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">
            Title Field
        </Label>
        <p className="text-xl">{title}</p>
    </div>
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

const PropertiesComponent = ({ elementInstance } : { elementInstance: FormElementInstance }) => {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            title: element.extraAttributes.title,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                title: values.title,
            }
        })
    }

    return (
        <Form {...form}>
            <form onBlur={form.handleSubmit(applyChanges)} onSubmit={e => {
                e.preventDefault();
            }} className="space-y-3">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} onKeyDown={e => {
                                    if(e.key === "Enter") {
                                        e.currentTarget.blur()
                                    }
                                }} />
                            </FormControl>
                            <FormDescription>
                                The title of the form. 
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

const FormComponent = ({ elementInstance } : { elementInstance: FormElementInstance }) => {
    const element = elementInstance as CustomInstance;
    const { title } = element.extraAttributes;
    return <p className="text-xl">{title}</p>
}

export const TitleFieldFormElement: FormElement = {
    type,
    designerComponents: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: LuHeading1,
        label: "Title Field"
    },
    validate: () => true
}


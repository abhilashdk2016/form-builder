"use client";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";

const type: ElementsType = "ParagraphField";
const extraAttributes = {
    text: "Text"
};
const propertiesSchema = z.object({
    text: z.string().min(2).max(500)
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const DesignerComponent = ({ elementInstance } : { elementInstance: FormElementInstance }) => {
    const element = elementInstance as CustomInstance;
    const { text } = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">
            <p>{text}</p>
        </Label>
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
            text: element.extraAttributes.text,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                text: values.text,
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
                    name="text"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Text</FormLabel>
                            <FormControl>
                                <Textarea rows={5} {...field} onKeyDown={e => {
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

export const ParagraphFieldFormElement: FormElement = {
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
        icon: BsTextParagraph,
        label: "Paragraph Field"
    },
    validate: () => true
}


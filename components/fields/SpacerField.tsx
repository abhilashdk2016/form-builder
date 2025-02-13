"use client";

import { LuSeparatorHorizontal } from "react-icons/lu";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements";
import { Label } from "../ui/label";
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
import { Slider } from "../ui/slider";

const type: ElementsType = "SpacerField";
const extraAttributes = {
    height: 20
};
const propertiesSchema = z.object({
    height: z.number().min(5).max(200)
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const DesignerComponent = ({ elementInstance } : { elementInstance: FormElementInstance }) => {
    const element = elementInstance as CustomInstance;
    const { height } = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full items-center">
        <Label className="text-muted-foreground">
            Spacer field: {height}px
        </Label>
        <LuSeparatorHorizontal className="h-8 w-8" />
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
            height: element.extraAttributes.height,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                height: values.height,
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
                    name="height"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Height (px): {form.watch("height")}</FormLabel>
                            <FormControl className="pt-2">
                                <Slider defaultValue={[field.value]} min={5} max={200} step={1} onValueChange={(value => {
                                    field.onChange(value[0]);
                                })} />
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
    const { height } = element.extraAttributes;
    return <div style={{ height, width: "100%"}} />
}

export const SpacerFieldFormElement: FormElement = {
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
        icon: LuSeparatorHorizontal,
        label: "Spacer Field"
    },
    validate: () => true
}


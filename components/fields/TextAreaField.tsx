"use client";

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
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { BsTextareaResize } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";

const type: ElementsType = "TextAreaField";
const extraAttributes = {
    label: "Text Area field",
    helperText: "Helper text",
    required: false,
    placeHolder: "Value Here...",
    rows: 3,
};
const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false),
    placeHolder: z.string().max(50),
    rows: z.number().min(1).max(10)
});
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

const DesignerComponent = ({ elementInstance } : { elementInstance: FormElementInstance }) => {
    const element = elementInstance as CustomInstance;
    const { label, required, placeHolder, helperText, rows } = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label>
            {label}
            {required && "*"}
        </Label>
        <Textarea readOnly disabled placeholder={placeHolder} />
        {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
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
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeHolder: element.extraAttributes.placeHolder,
            rows: element.extraAttributes.rows,
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label: values.label,
                helperText: values.helperText,
                required: values.required,
                placeHolder: values.placeHolder,
                rows: values.rows,
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
                    name="label"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input {...field} onKeyDown={e => {
                                    if(e.key === "Enter") {
                                        e.currentTarget.blur()
                                    }
                                }} />
                            </FormControl>
                            <FormDescription>
                                The label of the field. <br /> It will be displayed above the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="placeHolder"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Placeholder</FormLabel>
                            <FormControl>
                                <Input {...field} onKeyDown={e => {
                                    if(e.key === "Enter") {
                                        e.currentTarget.blur()
                                    }
                                }} />
                            </FormControl>
                            <FormDescription>
                                Placeholder of the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Helper Text</FormLabel>
                            <FormControl>
                                <Input {...field} onKeyDown={e => {
                                    if(e.key === "Enter") {
                                        e.currentTarget.blur()
                                    }
                                }} />
                            </FormControl>
                            <FormDescription>
                                Helper text for the field
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="required"
                    render={({field}) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Required</FormLabel>
                                
                                <FormDescription>
                                    Defienes if field is required or not
                                </FormDescription>
                                <FormMessage />
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rows"
                    render={({field}) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <FormLabel>Helper Text</FormLabel>
                            <FormControl>
                                <Slider defaultValue={[field.value]} min={1} max={10} step={1} onValueChange={value => field.onChange(value[0])} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

const FormComponent = ({ elementInstance, submitValue, isInvalid, defaultValue } : { elementInstance: FormElementInstance, submitValue? : SubmitFunction, isInvalid? : boolean, defaultValue?: string }) => {
    const element = elementInstance as CustomInstance;
    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);
    useEffect(() => {
        setError(isInvalid === true);
    }, [isInvalid]);
    const { label, required, placeHolder, helperText, rows } = element.extraAttributes;
    return <div className="flex flex-col gap-2 w-full">
        <Label className={cn(error && "text-red-500")}>
            {label}
            {required && "*"}
        </Label>
        <Textarea placeholder={placeHolder} onChange={e => setValue(e.target.value)} onBlur={e => {
            if(!submitValue) return;
            const valid = TextAreaFieldFormElement.validate(element, e.target.value);
            setError(!valid);
            if(!valid) return;
            submitValue(element.id, e.target.value)
        }} value={value} className={cn(error && "border-red-500")} rows={rows} />
        {helperText && <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>}
    </div>
}

export const TextAreaFieldFormElement: FormElement = {
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
        icon: BsTextareaResize,
        label: "TextArea Field"
    },
    validate: (formElement: FormElementInstance, currentValue: string) : boolean => {
        const element = formElement as CustomInstance;
        if(element.extraAttributes.required) {
            return currentValue.length > 0;
        }
        return true;
    }
}


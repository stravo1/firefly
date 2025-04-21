import React from 'react';
import { useFieldArray, useFormContext, FieldErrors } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash, XCircle } from 'lucide-react';

export function VariantsSection() {
    // Get the parent's form context
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<{
        variants: { name: string; values: string[] }[];
    }>();

    // Field array for variant options (e.g., Size, Color)
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variants', // Ensure the parent form has a matching field name
    });

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Variants</h3>
            {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <Input
                            {...register(`variants.${index}.name`)}
                            placeholder="Variant name (e.g., Size)"
                            className="w-full"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                            className="ml-2 bg-red-500"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                    {errors.variants && (
                        <p className="text-red-600 text-sm">{errors.variants[index]?.name?.message}</p>
                    )}
                    <ValuesField control={control} optionIndex={index} register={register} />
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', values: [''] })}
                className="flex items-center gap-2"
            >
                <PlusCircle className="h-4 w-4" />
                Add {fields.length > 0 ? "another" : ""} variant
            </Button>
        </div>
    );
}

function ValuesField({
    control,
    optionIndex,
    register,
}: {
    control: any;
    optionIndex: number;
    register: any;
}) {
    // Field array for variant values inside a variant option (e.g., Small, Medium, Large)
    const { fields, append, remove } = useFieldArray({
        control,
        name: `variants.${optionIndex}.values`,
        rules: {
            required: 'At least one value is required',
        },
    });

    const { formState: {errors} } = useFormContext<{
        variants: { name: string; values: string[] }[];
    }>();

    return (
        <div className="space-y-2 mt-2">
            {fields.map((field, valueIndex) => (
                <div key={field.id} className="flex items-center gap-2">
                    <Input
                        {...register(`variants.${optionIndex}.values.${valueIndex}`)}
                        placeholder="Enter value (e.g., Medium)"
                        className="w-full"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(valueIndex)}
                    >
                        <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            ))}
            {errors.variants && errors.variants[optionIndex]?.values && (
                <p className="text-red-600 text-sm">
                    {errors.variants[optionIndex]?.values[0]?.message}
                </p>
            )}
            <Button
                type="button"
                variant="outline"
                onClick={() => append('')}
                className="flex items-center gap-2"
            >
                <PlusCircle className="h-4 w-4" />
                Add {fields.length > 0 ? "another" : ""} value
            </Button>
        </div>
    );
}

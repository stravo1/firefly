import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDatabase, set } from 'firebase/database';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { VariantsSection } from './VariantsSection';
import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useAtom } from 'jotai';
import { databaseApp } from '@/states/firebaseStates';
import { firebaseAppAsAdmin } from '@/config';
import { setData } from '@/utils/databaseOperations';
import { LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';

// Add check for FileList availability
const isFileList = (value: unknown): value is FileList => {
    return typeof window !== 'undefined' && value instanceof FileList;
};

// Define a Zod schema for the form
const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    price: z.preprocess(
        (a) => parseFloat(a as string),
        z.number().positive('Price must be positive')
    ),
    compareAtPrice: z.preprocess(
        (a) => (a === '' ? undefined : parseFloat(a as string)),
        z.number().positive('Compare-at price must be positive').optional()
    ),
    chargeTax: z.preprocess((a) => (a === '' ? undefined : Boolean(a)), z.boolean().optional()),
    costPerItem: z.preprocess(
        (a) => (a === '' ? undefined : parseFloat(a as string)),
        z.number().positive('Cost per item must be positive').optional()
    ),
    quantity: z.preprocess(
        (a) => parseInt(a as string, 10),
        z.number().int('Quantity must be an integer').min(0, 'Quantity must be non-negative')
    ),
    trackQuantity: z.preprocess((a) => (a === '' ? undefined : Boolean(a)), z.boolean().optional()),
    variants: z
        .array(
            z.object({
                name: z.string().min(1, 'Variant name is required'),
                values: z
                    .array(z.string().min(1, 'Value is required'))
                    .min(1, 'At least one value is required'),
            })
        )
        .optional(),
    attachments: z
        .custom<FileList>((value) => isFileList(value), 'Must be a FileList')
        .refine((files) => files.length > 0, 'At least one image is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function AddProductFormDialog() {
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const [isOpen, setIsOpen] = useState(false);
    const [isPreviewOpen, setPreviewOpen] = useState(false);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [savingData, setSavingData] = useState(false);
    const [db, setDb] = useAtom(databaseApp);

    if (!db) {
        setDb(getDatabase(firebaseAppAsAdmin));
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = methods;

    const onSubmit = async (data: FormData) => {
        if (!db) return;
        setSavingData(true);

        console.log(data);
        const { attachments, ...rest } = data;
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const productData = {
            ...rest,
            slug,
        };
        await setData(db, 'products', slug, productData);
        reset(); // reset form on successful submission
        toast.success('Product added successfully');
        setIsOpen(false);
        setPreviewOpen(false);
        setSavingData(false);
    };

    useEffect(() => {
        console.log(errors);
    }, [errors]);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader className="mb-4">
                    <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="h-[70vh] overflow-y-scroll space-y-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    {...register('title')}
                                    placeholder="Product title"
                                />
                                {errors.title && (
                                    <p className="text-red-600 text-sm">{errors.title.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    {...register('description')}
                                    placeholder="Product description"
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Category</Label>
                                <Select
                                    defaultValue="clothing"
                                    onValueChange={(value) => methods.setValue('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="clothing">Clothing</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-red-600 text-sm">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        {...register('price')}
                                        placeholder="₹ 0.00"
                                    />
                                    {errors.price && (
                                        <p className="text-red-600 text-sm">
                                            {errors.price.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="compareAtPrice">Compare-at price</Label>
                                    <Input
                                        id="compareAtPrice"
                                        type="number"
                                        {...register('compareAtPrice')}
                                        placeholder="₹ 0.00"
                                    />
                                    {errors.compareAtPrice && (
                                        <p className="text-red-600 text-sm">
                                            {errors.compareAtPrice.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="chargeTax" {...register('chargeTax')} />
                                <Label htmlFor="chargeTax">Charge tax on this product</Label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="costPerItem">Cost per item</Label>
                                    <Input
                                        id="costPerItem"
                                        type="number"
                                        {...register('costPerItem')}
                                        placeholder="₹ 0.00"
                                    />
                                    {errors.costPerItem && (
                                        <p className="text-red-600 text-sm">
                                            {errors.costPerItem.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        {...register('quantity')}
                                        placeholder="0"
                                    />
                                    {errors.quantity && (
                                        <p className="text-red-600 text-sm">
                                            {errors.quantity.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="trackQuantity" {...register('trackQuantity')} />
                                <Label htmlFor="trackQuantity">Track quantity</Label>
                            </div>
                            <hr />
                            <div className="flex flex-col justify-center gap-4 my-4">
                                <Label className="shrink-0 font-semibold" htmlFor="image">
                                    Upload product images
                                </Label>
                                <Input
                                    type="file"
                                    id="filePicker"
                                    accept="image/*"
                                    {...register('attachments')}
                                    className="hidden"
                                    multiple
                                />
                                <Button
                                    className="w-fit flex justify-center items-center gap-2"
                                    variant="outline"
                                    onClick={() =>
                                        (
                                            document.querySelector(
                                                '#filePicker'
                                            ) as HTMLInputElement
                                        ).click()
                                    }
                                >
                                    <ImagePlus /> Add Images
                                </Button>
                                {errors.attachments && (
                                    <p className="text-red-600 text-sm">
                                        {errors.attachments.message}
                                    </p>
                                )}
                                {watch('attachments') && (
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(watch('attachments')).map((file, index) => (
                                            <div
                                                key={index}
                                                className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center cursor-pointer relative"
                                                onClick={() => {
                                                    setAttachment(file);
                                                    setPreviewOpen(true);
                                                }}
                                            >
                                                <div className="absolute top-1 right-1 p-1">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-6 h-6 cursor-pointer text-gray-400"
                                                        size="icon"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const files = watch('attachments');
                                                            const newFiles = Array.from(
                                                                files
                                                            ).filter((_, i) => i !== index);
                                                            const dataTransfer = new DataTransfer();
                                                            newFiles.forEach((file) =>
                                                                dataTransfer.items.add(file)
                                                            );
                                                            methods.setValue(
                                                                'attachments',
                                                                dataTransfer.files
                                                            );
                                                        }}
                                                    >
                                                        &times;
                                                    </Button>
                                                </div>
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <hr />
                            <VariantsSection />
                        </div>
                        <DialogFooter className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button variant="outline" type="button" disabled={savingData}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={savingData}>
                                {savingData && (
                                    <LuLoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                                )}
                                Save Product
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
                <PreviewAttachmentModal
                    isOpen={isPreviewOpen}
                    onClose={() => setPreviewOpen(false)}
                    attachment={attachment}
                />
            </DialogContent>
        </Dialog>
    );
}

const PreviewAttachmentModal = ({
    isOpen,
    onClose,
    attachment,
}: {
    isOpen: boolean;
    onClose: () => void;
    attachment: File | null;
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Preview Attachment</DialogTitle>
                </DialogHeader>
                {attachment && (
                    <img
                        src={URL.createObjectURL(attachment)}
                        alt="Preview"
                        className="w-full h-auto"
                    />
                )}
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

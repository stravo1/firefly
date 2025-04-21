'use client';

import CheckForAuthAdmin from '@/components/admin/CheckForAuthAdmin';
import AddProductForm from '@/components/admin/products/ProductForm';
import { LuView } from 'react-icons/lu';

export default function AdminRoot() {
    return (
        <CheckForAuthAdmin>
            <AddProductForm />
        </CheckForAuthAdmin>
    );
}

'use client';

import CheckForAuthAdmin from '@/components/admin/CheckForAuthAdmin';
import { LuView } from 'react-icons/lu';

export default function AdminRoot() {
    return (
        <CheckForAuthAdmin>
            hi
        </CheckForAuthAdmin>
    );
}

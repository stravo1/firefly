'use client';

import CheckForAuthAdmin from '@/components/admin/CheckForAuthAdmin';
import { LuView } from 'react-icons/lu';

export default function AdminRoot() {
    return (
        <CheckForAuthAdmin>
            <div className="w-full flex flex-col gap-4 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Orders</h1>
                </div>
                <div className="h-full flex justify-center items-center">Coming Soon...</div>
            </div>
        </CheckForAuthAdmin>
    );
}

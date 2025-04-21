'use client';

import CheckForAuthAdmin from '@/components/admin/CheckForAuthAdmin';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { firebaseAppAsAdmin } from '@/config';
import { getAuth, signOut } from 'firebase/auth';
import { LuLogOut } from 'react-icons/lu';

const auth = getAuth(firebaseAppAsAdmin);

export default function AdminRoot() {
    return (
        <CheckForAuthAdmin>
            <div className="flex flex-col items-center h-full w-full mx-auto bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                <section className="flex items-center justify-between h-fit w-full mx-auto">
                </section>
                <h1>Admin Dashboard</h1>
            </div>
        </CheckForAuthAdmin>
    );
}

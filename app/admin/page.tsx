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
        <CheckForAuthAdmin>X
            <div className="flex flex-col items-center h-full w-full mx-auto">
                <section className="flex items-center justify-between h-fit w-full mx-auto">
                    <SidebarTrigger className="m-4 cursor-pointer" />
                </section>
                <h1>Admin Dashboard</h1>
            </div>
        </CheckForAuthAdmin>
    );
}

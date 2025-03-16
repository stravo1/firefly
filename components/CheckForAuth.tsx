'use client';
import { firebaseAppAsAdmin } from '@/config';
import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const auth = getAuth(firebaseAppAsAdmin);
connectAuthEmulator(auth, 'http://127.0.0.1:9099');

export default function CheckForAuth({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/admin/login');
            }
        });
        return unsubscribe;
    }, [auth, router]);
    return <>{children}</>;
}

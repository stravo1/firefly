'use client';
import { firebaseAppAsAdmin } from '@/config';
import { adminUser } from '@/states/adminStates';
import { connectAuthEmulator, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useSetRecoilState } from 'recoil';
import { toast } from 'sonner';

const auth = getAuth(firebaseAppAsAdmin);
// connectAuthEmulator(auth, 'http://127.0.0.1:9099');

export default function CheckForAuthAdmin({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const setAdminUser = useSetRecoilState(adminUser);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/admin/login');
                setAdminUser(null);
            }
            user
                ?.getIdTokenResult()
                .then((token) => {
                    if (token.claims.admin !== true) {
                        router.push('/admin/login');
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('An error occurred while checking authentication');
                });
        });
        return unsubscribe;
    }, [auth, router]);
    if (loading) {
        return (
            <div className="fixed w-screen h-screen flex justify-center items-center gap-2 inset-0 z-50 bg-white">
                <LuLoader className="w-6 h-6 animate-spin" /> Loading...
            </div>
        );
    }
    return <>{children}</>;
}

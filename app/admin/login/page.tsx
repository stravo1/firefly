'use client';

import { GalleryVerticalEnd } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { LuLoader, LuLogIn, LuSparkles } from 'react-icons/lu';
import { firebaseAppAsAdmin } from '@/config';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const auth = getAuth(firebaseAppAsAdmin);
// connectAuthEmulator(auth, 'http://127.0.0.1:9099');

function LoginForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [loadingSignIn, setLoadingSignIn] = useState(false);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        setLoadingSignIn(true);
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                user.getIdTokenResult().then((token) => {
                    if (token.claims.admin == true) {
                        toast.success('Signed in successfully');
                    } else {
                        toast.error('You are not an admin.');
                    }
                });
                setLoadingSignIn(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                toast.error(errorMessage);
                setLoadingSignIn(false);
            });
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if ((await user.getIdTokenResult()).claims.admin == true) {
                    router.push('/admin');
                }
            }
            setTimeout(() => {
                setLoading(false);
            }, 100);
        });
        return unsubscribe;
    }, [auth, router]);

    return (
        <>
            <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h1 className="text-2xl font-bold">Login as Admin</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={loadingSignIn}
                            className="flex gap-2 w-full p-6 bg-gray-900 hover:bg-gray-800 cursor-pointer"
                        >
                            Login{' '}
                            {loadingSignIn ? (
                                <LuLoader className="w-6 h-6 animate-spin" />
                            ) : (
                                <LuLogIn className="w-6 h-6" />
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
}

export default function LoginPage() {
    return (
        <div className="fixed inset-0 bg-white w-screen h-screen grid min-h-svh lg:grid-cols-2 z-50">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Acme Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="https://images.unsplash.com/photo-1740422699287-d8bdbbaec629?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}

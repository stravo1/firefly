"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { LuLoader, LuLogIn, LuSparkles } from "react-icons/lu";
import { RiAdminLine } from "react-icons/ri";
import { firebaseAppAsAdmin } from "@/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const auth = getAuth(firebaseAppAsAdmin);
connectAuthEmulator(auth, "http://127.0.0.1:9099");

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [loadingSignIn, setLoadingSignIn] = useState(false);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
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
                        toast.success("Signed in successfully");
                    } else {
                        toast.error("You are not an admin.");
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
                    router.push("/admin");
                }
            }
            setTimeout(() => {
                setLoading(false);
            }, 100);
        });
        return unsubscribe;
    }, [auth, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen font-medium">
                Loading...
            </div>
        );
    }
    return (
        <main className="flex flex-col items-center justify-center h-screen w-screen mx-auto text-gray-500">
            <div className="max-w-[300px] w-full flex flex-col justify-center items-center p-8 py-16 border border-gray-200 rounded-lg shadow-lg">
                <RiAdminLine className="w-8 h-8 mb-2" />
                <h1 className="text-lg font-bold mb-4">Admin Login</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-full"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Email address"
                                            {...field}
                                        />
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
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={loadingSignIn}
                            className="flex gap-2 w-full p-6 bg-gray-600 hover:bg-gray-700 cursor-pointer"
                        >
                            Login{" "}
                            {loadingSignIn ? (
                                <LuLoader className="w-6 h-6 animate-spin" />
                            ) : (
                                <LuLogIn className="w-6 h-6" />
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </main>
    );
}

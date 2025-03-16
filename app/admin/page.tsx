"use client";

import CheckForAuthAdmin from "@/components/CheckForAuthAdmin";
import { Button } from "@/components/ui/button";
import { firebaseAppAsAdmin } from "@/config";
import { getAuth, signOut } from "firebase/auth";
import { LuLogOut } from "react-icons/lu";

const auth = getAuth(firebaseAppAsAdmin);

export default function AdminRoot() {
    return (
        <CheckForAuthAdmin>
            <div className="flex flex-col items-center justify-center h-screen w-screen mx-auto">
                <Button
                    className="flex fixed top-0 right-0 bg-white text-gray-500 m-4 cursor-pointer hover:text-gray-700 hover:bg-gray-100"
                    title="Sign out"
                    onClick={() => {
                        signOut(auth);
                    }}
                >
                    <LuLogOut className="w-6 h-6" />
                </Button>
                <h1>Admin Dashboard</h1>
            </div>
        </CheckForAuthAdmin>
    );
}

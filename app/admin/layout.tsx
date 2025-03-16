import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import RecoilContextProvider from '@/utils/recoilContextProvider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
// import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: "ADMIN - Pukuli's Shop",
    description: 'Kawaii, aesthetic, and tote-tally awesome tote bags!',
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <html lang="en">
                <body className={`${inter.variable} antialiased`}>
                    <AdminSidebar />
                    <main className="w-full h-screen flex flex-col">
                        <RecoilContextProvider>{children}</RecoilContextProvider>
                        <Toaster />
                    </main>
                </body>
            </html>
        </SidebarProvider>
    );
}

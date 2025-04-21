import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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
                        <div className="flex flex-col items-center h-full w-full mx-auto bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                            <div className="flex w-full justify-between items-center">
                                <SidebarTrigger className="m-4 cursor-pointer" />
                            </div>
                            {children}
                        </div>
                        <Toaster />
                    </main>
                </body>
            </html>
        </SidebarProvider>
    );
}

'use client';
import { LuBadgePercent, LuLayers, LuPackage, LuSettings, LuSparkles, LuTag } from 'react-icons/lu';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarUser } from './SidebarAccount';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LucideHome } from 'lucide-react';

// Menu items.
const user = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
};

const items = [
    {
        title: 'Home',
        url: '',
        icon: LucideHome,
    },
    {
        title: 'Products',
        url: 'products',
        icon: LuTag,
    },
    {
        title: 'Categories',
        url: 'categories',
        icon: LuLayers,
    },
    {
        title: 'Orders',
        url: 'orders',
        icon: LuPackage,
    },
    {
        title: 'Discounts',
        url: 'discounts',
        icon: LuBadgePercent,
    },
    {
        title: 'Settings',
        url: 'settings',
        icon: LuSettings,
    },
];

export function AdminSidebar() {
  const pathname = usePathname()
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gray-300">
                                    <LuSparkles className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Firefly Dashboard</span>
                                    <span className="text-xs">v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={index ? pathname.endsWith(item.url) : pathname === '/admin'}>
                                        <Link href={`/admin/${item.url}`}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}

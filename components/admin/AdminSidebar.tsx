'use client';
import { LuCalendar, LuHouse, LuInbox, LuSearch, LuSettings, LuSparkles } from 'react-icons/lu';

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
import { SidebarUser } from './SidebarUser';

// Menu items.
const user = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
};

const items = [
    {
        title: 'Home',
        url: '#',
        icon: LuHouse,
    },
    {
        title: 'Inbox',
        url: '#',
        icon: LuInbox,
    },
    {
        title: 'Calendar',
        url: '#',
        icon: LuCalendar,
    },
    {
        title: 'Search',
        url: '#',
        icon: LuSearch,
    },
    {
        title: 'Settings',
        url: '#',
        icon: LuSettings,
    },
];

export function AdminSidebar() {
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
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
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

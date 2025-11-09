import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Users, FileEdit, History, BarChart3 } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

type PageProps = {
    auth?: {
        user?: {
            role?: string;
        };
    };
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Warga',
        href: '/warga',
        icon: Users,
    },
    {
        title: 'Pengajuan',
        href: '/pengajuan',
        icon: FileEdit,
    },
];

const adminNavItems: NavItem[] = [
    ...mainNavItems,
    {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
    },
    {
        title: 'Log Aktivitas',
        href: '/activity-log',
        icon: History,
    },
];

export function AppSidebar() {
    const { props } = usePage<PageProps>();
    const isAdmin = props.auth?.user?.role === 'admin';
    const navItems = isAdmin ? adminNavItems : mainNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

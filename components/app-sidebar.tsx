'use client';

import { LayoutDashboard, Users, PawPrint, CalendarDays, Receipt } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { PetboardBranding } from '@/components/petboard-branding';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Customers',
    url: '/customers',
    icon: Users,
  },
  {
    title: 'Pets',
    url: '/pets',
    icon: PawPrint,
  },
  {
    title: 'Bookings',
    url: '/bookings',
    icon: CalendarDays,
  },
  {
    title: 'Invoices',
    url: '/invoices',
    icon: Receipt,
  },
];

const user = {
  name: 'Admin',
  email: 'admin@petboard.com',
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mb-2">
        <PetboardBranding />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

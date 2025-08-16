import type React from 'react';
import type { Metadata } from 'next';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserSidebar, ThemeToggle } from '@/components';
import { DynamicBreadcrumbs } from '@/shared/base/client';

export const metadata: Metadata = {
  title: {
    default: 'User Panel – Queryon',
    template: '%s | User Panel – Queryon',
  },
  description: 'Manage your widgets, conversations, and account.',
  alternates: { canonical: '/user' },
  robots: { index: false, follow: true },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-20">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumbs />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

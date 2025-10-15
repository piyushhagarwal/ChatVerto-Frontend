import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

export default function DashboardLayout() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': isExpanded
            ? 'calc(var(--spacing) * 72)'
            : 'calc(var(--spacing) * 16)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" onExpandedChange={setIsExpanded} />
      <SidebarInset className="transition-all duration-800 ease-in-out">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

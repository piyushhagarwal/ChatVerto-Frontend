import { type Icon } from '@tabler/icons-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  collapsed?: boolean;
}

export function NavMain({ items, collapsed = false }: NavMainProps) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map(item => {
            const isActive = location.pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`
                w-full flex items-center
                h-10 px-1 rounded-sm 
                transition-all duration-800
                ${isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground ' : 'text-sidebar-foreground'}
              `}
                  tooltip={collapsed ? item.title : undefined}
                >
                  <NavLink
                    to={item.url}
                    className={`
                  flex items-center w-full
                  ${collapsed ? 'justify-start px-0' : 'px-4'}
                `}
                  >
                    {item.icon && (
                      <item.icon
                        className={`flex-shrink-0  ${
                          collapsed ? 'm-0 p-[1px]' : 'mr-2'
                        } scale-150`}
                        stroke={1.5}
                      />
                    )}
                    {!collapsed && (
                      <span className="whitespace-nowrap">{item.title}</span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

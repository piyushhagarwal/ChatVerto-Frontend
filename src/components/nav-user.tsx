import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { IconUser } from '@tabler/icons-react';

interface NavUserProps {
  user: {
    name: string;
    avatar: string;
  };
  collapsed?: boolean;
}

export function NavUser({ user, collapsed = false }: NavUserProps) {
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={() => navigate('/dashboard/profile')}
          className={`
            cursor-pointer hover:bg-secondary text-primary bg-accent
            ${collapsed ? 'justify-center px-2' : ''}
          `}
          tooltip={collapsed ? user.name : undefined}
        >
          <Avatar className="h-10 w-10 rounded-lg ">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg flex items-center justify-center ">
              <IconUser className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 items-start justify-start text-sm leading-tight">
              <span className="truncate font-bold">{user.name}</span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

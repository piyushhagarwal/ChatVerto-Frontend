import * as React from 'react';
import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconHome,
  IconAddressBook,
  IconSettingsAutomation,
  IconMessageDots,
  IconChartBar,
  IconAdCircle,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
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

const data = {
  user: {
    name: 'Profile',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/dashboard/home1',
      icon: IconHome,
      isActive: true,
    },
    {
      title: 'Contacts',
      url: '/dashboard/contact',
      icon: IconAddressBook,
    },
    {
      title: 'Automations',
      url: '/dashboard/automation',
      icon: IconSettingsAutomation,
    },
    // {
    //   title: 'Chats',
    //   url: '/dashboard/chats',
    //   icon: IconMessageDots,
    // },
    {
      title: 'Advertise',
      url: '/dashboard/advertise/broadcast',
      icon: IconAdCircle,
    },
    {
      title: 'Analytics',
      url: '/dashboard/home',
      icon: IconChartBar,
      isActive: true,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: 'Settings',
  //     url: '#',
  //     icon: IconSettings,
  //   },
  //   {
  //     title: 'Get Help',
  //     url: '#',
  //     icon: IconHelp,
  //   },
  //   {
  //     title: 'Search',
  //     url: '#',
  //     icon: IconSearch,
  //   },
  // ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Reports',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({
  onExpandedChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onExpandedChange?: (expanded: boolean) => void;
}) {
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    onExpandedChange?.(isHovered);
  }, [isHovered, onExpandedChange]);

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={`transition-all duration-800 ease-in-out ${
        isHovered ? 'w-64' : 'w-18'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative w-full flex items-center justify-start">
              <a
                href="#"
                className={`transition-all duration-800 flex items-center ${
                  isHovered ? 'mb-0' : 'mb-6'
                }`}
              >
                <img
                  src="/Images/Chatverto.png"
                  alt="Acme Inc."
                  className={`transition-all duration-800 ${
                    isHovered
                      ? ' top-2 relative left-1 top-4 w-[180px] h-[45px] '
                      : 'w-[40px] h-[80px] '
                  }`}
                  style={{
                    objectFit: 'contain',
                    marginTop: isHovered ? '15px' : 'auto',
                    marginBottom: isHovered ? '70px' : '12px',
                    marginLeft: isHovered ? '0px' : 'auto',
                    marginRight: isHovered ? '10px' : 'auto',
                  }}
                />
                <img
                  src="/Images/chatverto1.png"
                  alt="Chatverto"
                  className={`transition-all duration-800 ${
                    isHovered
                      ? 'opacity-100 visible relative left-1 bottom-4'
                      : 'opacity-0 invisible'
                  }`}
                  style={{
                    height: '25px',
                    objectFit: 'contain',
                  }}
                />
              </a>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        className={`relative bottom-[35px] ${!isHovered ? 'px-2' : ''}`}
      >
        <NavMain items={data.navMain} collapsed={!isHovered} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} collapsed={!isHovered} />
      </SidebarFooter>
    </Sidebar>
  );
}

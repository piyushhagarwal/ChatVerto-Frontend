import { SiteHeader } from '@/components/site-header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Workflow,
  Megaphone,
  FileText,
  Users,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MainHomePage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  const modules = [
    {
      title: 'Flows',
      description:
        'Automate your WhatsApp interactions using visual flow builders.',
      icon: Workflow,
      action: 'Open Flows',
      path: '/dashboard/automation',
    },
    {
      title: 'Campaigns',
      description:
        'Create and manage broadcast campaigns for WhatsApp messaging.',
      icon: Megaphone,
      action: 'Create Campaign',
      path: '/dashboard/advertise/broadcast',
    },
    {
      title: 'Templates',
      description:
        'Manage pre-approved message templates for faster communication.',
      icon: FileText,
      action: 'View Templates',
      path: '/dashboard/advertise/templates',
    },
    {
      title: 'Contacts',
      description:
        'Manage all your WhatsApp contacts and organize them into groups for targeting.',
      icon: Users,
      action: 'Open Contacts',
      path: '/dashboard/contact',
    },
    {
      title: 'Analytics',
      description:
        'View campaign reports, message delivery, and engagement insights in one place.',
      icon: BarChart3,
      action: 'View Analytics',
      path: '/dashboard/analytics',
    },
  ];

  return (
    <>
      {loading && <p className="text-muted-foreground">Loading...</p>}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </p>
      )}

      <div className="min-h-screen rounded-2xl bg-muted/40">
        <SiteHeader title="Home" />

        {/* Welcome Section */}
        <div className="px-6 pt-6 pb-5">
          <div className="flex gap-1">
            <h2 className="text-2xl font-semibold">Welcome back, </h2>
            <h2 className="text-2xl font-semibold">
              {user?.whatsAppDetails?.verifiedName} 👋
            </h2>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage your WhatsApp automation system from one unified dashboard.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pb-0">
          <Card className="border-l-4 border-primary/80 bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-3">
              <Lightbulb className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Getting Started</CardTitle>
                <CardDescription>
                  💡 Not sure where to begin? Start by creating your first{' '}
                  <span className="font-medium text-primary">
                    automation flow
                  </span>{' '}
                  or a new WhatsApp campaign to reach your audience instantly.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Main Feature Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10">
          {modules.map((mod, index) => (
            <Card
              key={index}
              className="transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <mod.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{mod.title}</CardTitle>
                  <CardDescription>{mod.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="mt-2 w-full"
                  onClick={e => {
                    e.stopPropagation(); // prevent triggering card click
                    navigate(mod.path); // ✅ button redirects
                  }}
                >
                  {mod.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Getting Started Section */}
      </div>
    </>
  );
}

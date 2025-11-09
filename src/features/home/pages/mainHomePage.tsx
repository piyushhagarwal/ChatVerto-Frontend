import { SiteHeader } from '@/components/site-header';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Workflow,
  Megaphone,
  FileText,
  Users,
  BarChart3,
  PlusCircle,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

export default function MainHomePage() {
  const modules = [
    {
      title: 'Flows',
      description:
        'Automate your WhatsApp interactions using visual flow builders.',
      icon: Workflow,
      action: 'Open Flows',
    },
    {
      title: 'Campaigns',
      description:
        'Create and manage broadcast campaigns for WhatsApp messaging.',
      icon: Megaphone,
      action: 'Create Campaign',
    },
    {
      title: 'Templates',
      description:
        'Manage pre-approved message templates for faster communication.',
      icon: FileText,
      action: 'View Templates',
    },
    {
      title: 'Contacts',
      description:
        'Manage all your WhatsApp contacts and organize them into groups for targeting.',
      icon: Users,
      action: 'Open Contacts',
    },
    {
      title: 'Analytics',
      description:
        'View campaign reports, message delivery, and engagement insights in one place.',
      icon: BarChart3,
      action: 'View Analytics',
    },
  ];

  return (
    <div className="min-h-screen rounded-2xl bg-muted/40">
      <SiteHeader title="Home" />

      {/* Welcome Section */}
      <div className="px-6 pt-6">
        <h2 className="text-2xl font-semibold">Welcome back, Aditya 👋</h2>
        <p className="text-muted-foreground mt-1">
          Manage your WhatsApp automation system from one unified dashboard.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <Card className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="default" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Campaign
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" /> Create Flow
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Add Contact / Group
            </Button>
            <Button variant="secondary" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> View Analytics
            </Button>
          </div>
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
              <Button className="mt-2 w-full">{mod.action}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting Started Section */}
      <div className="px-6 pb-10">
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

      {/* Optional Announcement */}
      <div className="px-6 pb-10">
        <Card className="border-l-4 border-primary/80 bg-primary/5">
          <CardHeader className="flex flex-row items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">What’s New</CardTitle>
              <CardDescription>
                🚀 You can now schedule campaigns to auto-send on specific
                dates. Try it today!
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

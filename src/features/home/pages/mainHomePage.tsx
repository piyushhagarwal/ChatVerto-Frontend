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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Workflow,
  Megaphone,
  FileText,
  Users,
  BarChart3,
  Lightbulb,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WhatsAppSignupButton from '@/components/WhatsAppSignup';

export default function MainHomePage() {
  const dispatch = useAppDispatch();
  const isWhatsAppConnected = useAppSelector(
    state => state.user.user?.isWhatsappConnected
  );
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
      {/* Loading Dialog */}
      <Dialog open={loading}>
        <DialogContent
          className="sm:max-w-md [&>button]:hidden"
          style={{ backgroundColor: 'rgb(250, 255, 244)' }}
        >
          <DialogHeader className="items-center text-center space-y-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#CDDF7D' }}
              >
                <Loader2
                  className="h-8 w-8 animate-spin"
                  style={{ color: '#064734' }}
                />
              </div>
              <div
                className="absolute inset-0 w-16 h-16 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: '#CDDF7D' }}
              ></div>
            </div>
            <DialogTitle
              className="text-xl font-semibold"
              style={{ color: '#064734' }}
            >
              Loading
            </DialogTitle>
            <DialogDescription
              className="text-base"
              style={{ color: '#064734', opacity: 0.7 }}
            >
              Please wait while we load your homepage...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={!!error}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error
            </DialogTitle>
            <DialogDescription className="text-red-600">
              {error}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content - Only visible when not loading */}
      {!loading && (
        <div className="min-h-screen rounded-2xl ">
          <SiteHeader title="Home" />
          {/* Welcome Section */}
          <div>
            {!isWhatsAppConnected ? (
              <div className="text-center py-8">
                <h2 className="text-xl mb-4">
                  Connect Your WhatsApp Business Account
                </h2>
                <p className="text-gray-600 mb-6">
                  To start using ChatVerto features, please connect your
                  WhatsApp Business account
                </p>
                <WhatsAppSignupButton />
              </div>
            ) : (
              <>
                <div className="px-6 pt-6 pb-5">
                  <div className="flex gap-1">
                    <h2 className="text-2xl font-semibold">Welcome back, </h2>
                    <h2 className="text-2xl font-semibold">
                      {user?.whatsAppDetails?.verifiedName} 👋
                    </h2>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Manage your WhatsApp automation system from one unified
                    dashboard.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="px-6 pb-0">
                  <Card className="border-l-4 border-primary/80 bg-primary/5">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          Getting Started
                        </CardTitle>
                        <CardDescription>
                          💡 Not sure where to begin? Start by creating your
                          first{' '}
                          <span className="font-medium text-primary">
                            automation flow
                          </span>{' '}
                          or a new WhatsApp campaign to reach your audience
                          instantly.
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* Main Feature Modules */}
                <div className="rounded-2xl backdrop-blur-md bg-white border border-white/20 shadow-[0_0_5px_rgba(0,0,0,0.2)] p-6  m-5 mt-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10 pt-10 ">
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
                              e.stopPropagation();
                              navigate(mod.path);
                            }}
                          >
                            {mod.action}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';

export default function Advertise() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <SiteHeader title="Advertise" />
      <div className="flex h-full w-full ">
        {/* Sidebar */}

        <aside className="w-64 h-[calc(116vh-64px)] ml-[5px] bg-white rounded-b-2xl shadow-[0_0_5px_rgba(0,0,0,0.2)] flex flex-col items-start justify-start mb-3">
          <div className="w-full px-4 py-4 pr-4 space-y-2">
            <Button
              variant={pathname.includes('broadcast') ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleNavigate('/dashboard/advertise/broadcast')}
            >
              Campaigns
            </Button>
            <Button
              variant={pathname.includes('templates') ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleNavigate('/dashboard/advertise/templates')}
            >
              Templates
            </Button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 h-full pl-2 pr-[5px] pb-3">
          <Outlet />
        </div>
      </div>
    </>
  );
}

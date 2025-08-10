import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

export function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64 ">
        <SheetHeader>
          <SheetTitle className="text-lg ">Advertise Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-2 mt-6">
          <Button
            variant={pathname.includes('broadcast') ? 'default' : 'ghost'}
            onClick={() => handleNavigate('/dashboard/advertise/broadcast')}
          >
            Broadcast
          </Button>
          <Button
            variant={pathname.includes('templates') ? 'default' : 'ghost'}
            onClick={() => handleNavigate('/dashboard/advertise/templates')}
          >
            Templates
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IconMenu2 } from '@tabler/icons-react';
import { useAppDispatch } from '@/store/hooks';
import { logoutThunk } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface SiteHeaderProps {
  title: string;
}

export function SiteHeader({ title }: SiteHeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login');
  };
  return (
    <header className="flex h-20 shrink-0 items-center bg-primary gap-2 border-t-5 border-l-5 border-r-5 border-[#fafff4ff] text-accent rounded-t-lg transition-all duration-800 ease-in-out">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-1 hover:bg-primary/10"
        >
          <IconMenu2 className="h-5 w-5 text-accent" />
        </Button>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            onClick={handleLogout}
            className="bg-accent text-primary hover:bg-accent/80"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

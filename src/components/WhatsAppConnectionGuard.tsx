import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function WhatsAppConnectionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isWhatsAppConnected = useAppSelector(
    state => state.user.user?.isWhatsappConnected
  );
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      isWhatsAppConnected === false &&
      location.pathname !== '/dashboard/home' &&
      location.pathname !== '/login' &&
      location.pathname !== '/register'
    ) {
      navigate('/dashboard/home', { replace: true });
    }
  }, [isWhatsAppConnected, navigate, location.pathname]);

  return <>{children}</>;
}

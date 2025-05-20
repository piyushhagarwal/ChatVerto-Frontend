import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (
      !token &&
      location.pathname !== '/login' &&
      location.pathname !== '/register'
    ) {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
}

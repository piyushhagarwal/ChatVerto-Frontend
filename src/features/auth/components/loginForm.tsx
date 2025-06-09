import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, loading, error } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    dispatch(clearError());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (token) {
      // Redirect to the dashboard or home page
      navigate('/dashboard/home', { replace: true });
    }
  }, [token, navigate]);

  // Clear error on unmount or form input
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {error && (
        <Alert
          variant="destructive"
          className="justify-items-start border-destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Login failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {token && (
        <Alert variant="default">
          <AlertTitle>Login successful</AlertTitle>
          <AlertDescription>
            You are now logged in. Redirecting...
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { registerUser, clearError } from '@/store/slices/authSlice'; // Make sure this exists

export function RegisterForm({
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
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (token) {
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
          <AlertTitle>Registration failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {token && (
        <Alert variant="default">
          <AlertTitle>Registration successful</AlertTitle>
          <AlertDescription>
            You are now registered. Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email and password to create an account
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
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  'Register'
                )}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

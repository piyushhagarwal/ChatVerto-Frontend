import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/userSlice';
import TopCard from '@/features/user/components/topCard';
import ProfileUpdateForm from '../components/profileUpdateform';
import { SiteHeader } from '@/components/site-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

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
              Please wait while we load your profile...
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
        <div className="space-y-6">
          <SiteHeader title="My Profile" />
          {user && (
            <>
              <TopCard user={user} />
              <ProfileUpdateForm />
              {/* Add more cards like <BusinessInfoCard user={user} /> later here */}
            </>
          )}
        </div>
      )}
    </>
  );
}

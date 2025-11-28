import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/userSlice';
import TopCard from '@/features/user/components/topCard';
import ProfileUpdateForm from '../components/profileUpdateform';
import { SiteHeader } from '@/components/site-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <SiteHeader title="My Profile" />

      {/* 🔴 Error */}
      {error && (
        <div className="h-30 w-full p-3 my-2 mb-4">
          <Alert
            variant="destructive"
            className="justify-items-start border-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* ⏳ Loading */}
      {loading && !error && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin" />
          <span className="text-lg  text-primary font-medium">
            Please wait...
          </span>
        </div>
      )}

      {/* ✅ Success */}
      {!loading && !error && user && (
        <>
          <TopCard user={user} />
          <ProfileUpdateForm />

          {/* Additional sections can be added here */}
          {/* <BusinessInfoCard user={user} /> */}
        </>
      )}
    </div>
  );
}

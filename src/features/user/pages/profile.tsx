import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/userSlice';
import TopCard from '@/features/user/components/topCard';
import ProfileUpdateForm from '../components/profileUpdateform';
import { ProfilePhotoUploader } from '../components/profilePhotoUploader';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {loading && <p className="text-muted-foreground">Loading...</p>}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded">
          {error}
        </p>
      )}

      {user && (
        <>
          <TopCard user={user} />
          <ProfilePhotoUploader />
          <ProfileUpdateForm />

          {/* Add more cards like <BusinessInfoCard user={user} /> later here */}
        </>
      )}
    </div>
  );
}

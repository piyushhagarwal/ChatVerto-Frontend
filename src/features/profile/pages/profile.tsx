import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getUserProfileThunk } from '@/store/slices/profileSlice';
import ProfilePhotoUploader from '@/features/profile/components/profilePhotoUploader';
import ProfileForm from '@/features/profile/components/profileForm';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.profile);

  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, [dispatch]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <p>Email: {user.email}</p>
      {user.isWhatsappConnected ? (
        <>
          <img
            src={user.whatsAppDetails?.profilePictureUrl || ''}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <p>Verified Name: {user.whatsAppDetails?.verifiedName}</p>
          <p>Phone: {user.whatsAppDetails?.displayPhoneNumber}</p>
          <ProfilePhotoUploader />
          <ProfileForm />
        </>
      ) : (
        <p className="text-red-600">WhatsApp is not connected.</p>
      )}
    </div>
  );
}

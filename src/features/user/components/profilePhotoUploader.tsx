import { useAppDispatch } from '@/store/hooks';
import {
  uploadProfilePicThunk,
  getUserProfileThunk,
} from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';

export default function ProfilePhotoUploader() {
  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadProfilePicThunk(file)).then(() => {
        dispatch(getUserProfileThunk());
      });
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="font-medium">Upload Profile Picture</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>
  );
}

import { useAppDispatch } from '@/store/hooks';
import {
  updateProfilePictureThunk,
  getUserProfileThunk,
} from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function ProfilePhotoUploader() {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile)); // For preview
  };

  const handleUpdate = async () => {
    if (!file) return;

    dispatch(updateProfilePictureThunk({ file })).then(() => {
      dispatch(getUserProfileThunk());
    });
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="profile-photo">Profile Picture</Label>
      <Input
        type="file"
        id="profile-photo"
        accept="image/*"
        onChange={handleChange}
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover border"
        />
      )}

      <Button onClick={handleUpdate} disabled={!file}>
        Update Profile Picture
      </Button>
    </div>
  );
}

import { useAppDispatch } from '@/store/hooks';
import {
  updateProfilePictureThunk,
  getUserProfileThunk,
} from '@/store/slices/userSlice';
import { Upload } from 'lucide-react';
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
    <div className="border-2 border-dashed border-gray-300 shadow-md p-6 m-2 bg-card space-y-4">
      <div className="text-center">
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />

        <p className="text-sm text-gray-600 mb-8">
          Click to upload or drag and drop
        </p>

        <div className="flex  pl-15 mb-3 justify-center">
          <input
            type="file"
            id="profile-photo"
            accept="image/*"
            onChange={handleChange}
            className="text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
          />
        </div>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 mx-auto mt-4 rounded-full object-cover border"
          />
        )}

        <Button
          onClick={handleUpdate}
          disabled={!file}
          className=" items-end mt-4"
        >
          Update Profile Picture
        </Button>
      </div>
    </div>
  );
}

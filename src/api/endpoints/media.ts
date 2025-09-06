import axios from '../axios';
import type { UploadMediaResponse } from '@/types/media';

export const uploadMedia = async (
  formData: FormData
): Promise<UploadMediaResponse> => {
  try {
    const response = await axios.post('/upload-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

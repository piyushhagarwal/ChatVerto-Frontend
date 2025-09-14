import axios from '../axios';
import type {
  UploadMediaResponse,
  UploadMediaByResumableApiResponse,
} from '@/types/media';

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

export const uploadMediaByResumableApi = async (
  formData: FormData
): Promise<UploadMediaByResumableApiResponse> => {
  try {
    const response = await axios.post('/upload-media/resumable', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading media via resumable API:', error);
    throw error;
  }
};

import type { ApiResponse } from './api';

export type UploadMediaResponse = ApiResponse<{
  mediaId: string;
}>;

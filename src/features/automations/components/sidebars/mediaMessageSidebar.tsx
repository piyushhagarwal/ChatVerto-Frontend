import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useState, useCallback } from 'react';
import { updateNodeData } from '@/store/slices/flowsSlice';
import { uploadMediaThunk, clearMediaState } from '@/store/slices/mediaSlice';
import { useAppDispatch } from '@/store/hooks';
import {
  Upload,
  X,
  Image,
  Video,
  FileText,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface MediaMessageSidebarProps {
  nodeId: string;
  initialData: {
    mediaType?: 'image' | 'video' | 'document';
    mediaId?: string;
    caption?: string;
    fileName?: string;
  };
  onClose?: () => void;
}

// Interface for media upload state
interface MediaUploadState {
  file: File | null;
  uploading: boolean;
  uploaded: boolean;
  mediaId: string | null;
  error: string | null;
}

// File size limits in MB
const FILE_SIZE_LIMITS = {
  image: 5,
  video: 16,
  document: 100,
};

export default function MediaMessageSidebar({
  nodeId,
  initialData,
  onClose,
}: MediaMessageSidebarProps) {
  const dispatch = useAppDispatch();
  const [mediaType, setMediaType] = useState<
    'image' | 'video' | 'document' | ''
  >(initialData.mediaType || '');
  const [caption, setCaption] = useState(initialData.caption || '');
  const [fileName, setFileName] = useState(initialData.fileName || '');
  const [isDragging, setIsDragging] = useState(false);

  // Media upload state
  const [mediaUpload, setMediaUpload] = useState<MediaUploadState>({
    file: null,
    uploading: false,
    uploaded: !!initialData.mediaId,
    mediaId: initialData.mediaId || null,
    error: null,
  });

  const handleSave = () => {
    const data: any = {
      mediaType: mediaType || undefined,
      mediaId: mediaUpload.mediaId || undefined,
      caption: caption || undefined,
    };

    // Add fileName only for documents
    if (mediaType === 'document') {
      data.fileName = fileName || undefined;
    }

    dispatch(
      updateNodeData({
        nodeId,
        data,
      })
    );
    if (onClose) onClose();
  };

  // Validate file size
  const validateFileSize = (
    file: File,
    type: 'image' | 'video' | 'document'
  ): { valid: boolean; error?: string } => {
    const fileSizeMB = file.size / 1024 / 1024;
    const limit = FILE_SIZE_LIMITS[type];

    if (fileSizeMB > limit) {
      return {
        valid: false,
        error: `File size exceeds ${limit}MB limit. Your file is ${fileSizeMB.toFixed(2)}MB.`,
      };
    }

    return { valid: true };
  };

  // Handle file selection and auto-upload (matching campaign logic)
  const handleFileSelect = async (file: File) => {
    // Validate file size first
    if (mediaType) {
      const validation = validateFileSize(
        file,
        mediaType as 'image' | 'video' | 'document'
      );

      if (!validation.valid) {
        setMediaUpload({
          file: null,
          uploading: false,
          uploaded: false,
          mediaId: null,
          error: validation.error || 'File size exceeds limit',
        });
        return;
      }
    }

    // Set the file and start uploading immediately
    setMediaUpload({
      file,
      uploading: true,
      uploaded: false,
      mediaId: null,
      error: null,
    });

    // Auto-upload the file using the same thunk as campaign
    try {
      const resultAction = await dispatch(uploadMediaThunk(file));

      if (uploadMediaThunk.fulfilled.match(resultAction)) {
        const uploadedMediaId = resultAction.payload;

        // Update upload state to success
        setMediaUpload(prev => ({
          ...prev,
          uploading: false,
          uploaded: true,
          mediaId: uploadedMediaId ?? null,
          error: null,
        }));

        // Auto-set filename for documents if not already set
        if (mediaType === 'document' && !fileName && file.name) {
          setFileName(file.name);
        }
      } else {
        // Handle upload error
        const errorMessage =
          (resultAction.payload as string) || 'Upload failed';
        setMediaUpload(prev => ({
          ...prev,
          uploading: false,
          uploaded: false,
          error: errorMessage,
        }));
      }
    } catch (error) {
      setMediaUpload(prev => ({
        ...prev,
        uploading: false,
        uploaded: false,
        error: 'Upload failed',
      }));
    }
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setMediaUpload({
      file: null,
      uploading: false,
      uploaded: false,
      mediaId: null,
      error: null,
    });

    // Clear filename for documents
    if (mediaType === 'document') {
      setFileName('');
    }

    // Clear media state from Redux
    dispatch(clearMediaState());
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && mediaType) {
        const file = files[0];
        handleFileSelect(file);
      }
    },
    [mediaType]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getAcceptedFileTypes = () => {
    switch (mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'document':
        return '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
      default:
        return '';
    }
  };

  const getMediaTypeIcon = () => {
    switch (mediaType) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <Upload className="w-5 h-5" />;
    }
  };

  // Handle media type change
  const handleMediaTypeChange = (value: string) => {
    setMediaType(value as 'image' | 'video' | 'document');
    // Reset upload state when changing media type
    removeUploadedFile();
    setFileName('');
  };

  // Get size limit text
  const getSizeLimitText = () => {
    if (!mediaType) return '';
    const limit = FILE_SIZE_LIMITS[mediaType as keyof typeof FILE_SIZE_LIMITS];
    return `Maximum file size: ${limit}MB`;
  };

  // Render media upload component (similar to campaign logic)
  const renderMediaUpload = (): React.ReactElement => {
    const acceptedTypes = getAcceptedFileTypes();

    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">Upload {mediaType} *</Label>

        {!mediaUpload.file && !mediaUpload.error ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center gap-3">
              {getMediaTypeIcon()}
              <p className="text-sm text-gray-600">
                Drag & drop your {mediaType} here, or click to browse
              </p>
              <input
                type="file"
                className="hidden"
                id="fileInput"
                accept={acceptedTypes}
                onChange={handleFileInputChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Browse Files
              </Button>
            </div>
          </div>
        ) : mediaUpload.error && !mediaUpload.file ? (
          <div className="border-2 border-red-200 bg-red-50 rounded-lg p-6">
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <p className="text-sm text-red-700 font-medium text-center">
                {mediaUpload.error}
              </p>
              <input
                type="file"
                className="hidden"
                id="fileInputRetry"
                accept={acceptedTypes}
                onChange={handleFileInputChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMediaUpload(prev => ({ ...prev, error: null }));
                  document.getElementById('fileInputRetry')?.click();
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {mediaUpload.file?.name}
                </div>
                <div className="text-xs text-gray-500">
                  (
                  {mediaUpload.file
                    ? (mediaUpload.file.size / 1024 / 1024).toFixed(2)
                    : '0'}{' '}
                  MB)
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeUploadedFile}
                className="h-8 w-8 p-0"
                disabled={mediaUpload.uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {mediaUpload.error && (
              <div className="text-sm text-red-600 mb-2">
                {mediaUpload.error}
              </div>
            )}

            <div className="flex items-center gap-2">
              {mediaUpload.uploaded ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Uploaded successfully
                </div>
              ) : mediaUpload.uploading ? (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              ) : mediaUpload.error ? (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Upload failed - {mediaUpload.error}
                </div>
              ) : null}
            </div>

            {mediaUpload.uploaded && mediaUpload.mediaId && (
              <div className="mt-2 text-xs text-gray-500">
                Media ID: {mediaUpload.mediaId}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500">
          {getSizeLimitText()}. The media ID will be automatically set after
          upload.
        </p>
      </div>
    );
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    if (!mediaType) return false;
    if (!mediaUpload.uploaded || !mediaUpload.mediaId) return false;
    return true;
  };

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-[400px] bg-white shadow-xl border-l pointer-events-auto overflow-y-auto">
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Media Message</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Media Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="mediaType" className="text-sm font-medium">
                Media Type *
              </Label>
              <Select value={mediaType} onValueChange={handleMediaTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Image
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem value="document">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Document
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Area */}
            {mediaType && renderMediaUpload()}

            {/* File Name (for documents only) */}
            {mediaType === 'document' && (
              <div className="space-y-2">
                <Label htmlFor="fileName" className="text-sm font-medium">
                  File Name <span className="text-gray-400">(optional)</span>
                </Label>
                <Input
                  id="fileName"
                  placeholder="Enter custom file name..."
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-sm font-medium">
                Caption <span className="text-gray-400">(optional)</span>
              </Label>
              <Textarea
                id="caption"
                rows={4}
                placeholder="Add a caption for your media..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full"
            onClick={handleSave}
            disabled={!isFormValid() || mediaUpload.uploading}
          >
            {mediaUpload.uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Save Media Message'
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

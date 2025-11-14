/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trash2,
  Loader2,
  Info,
  AlertCircle,
  Upload,
  X,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { createTemplateThunk } from '@/store/slices/templateSlice';
import { uploadMediaByResumableApiThunk } from '@/store/slices/mediaSlice';
import type {
  ButtonType,
  Component,
  CreateTemplatePayload,
  HeaderFormat,
  Button as TemplateButton,
  CTAButton,
} from '@/types/template';
import {
  countPositionalArgs,
  renderTextWithArgs,
} from '../helpers/templateHelpers';
import { validateField } from '../helpers/templateValidations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Interface for media upload states
interface MediaUploadState {
  [key: string]: {
    file: File | null;
    uploading: boolean;
    uploaded: boolean;
    mediaHandle: string | null;
    error: string | null;
  };
}

export default function CreateTemplatePage() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.template);

  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState<
    'AUTHENTICATION' | 'MARKETING' | 'UTILITY' | ''
  >('');
  const [language, setLanguage] = useState('');
  const [headerType, setHeaderType] = useState<HeaderFormat | ''>('');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [ctaButtons, setCtaButtons] = useState<CTAButton[]>([
    { label: '', url: '', type: 'URL' },
  ]);
  const [quickReplyButtons, setQuickReplyButtons] = useState<string[]>(['']);
  const [phoneButton, setPhoneButton] = useState({
    label: '',
    phone_number: '',
  });
  const [useQuickReply, setUseQuickReply] = useState(false);
  const [usePhoneButton, setUsePhoneButton] = useState(false);
  const [mediaUploads, setMediaUploads] = useState<MediaUploadState>({});

  // New state for positional arguments
  const [headerExamples, setHeaderExamples] = useState<string[]>(['']);
  const [bodyExamples, setBodyExamples] = useState<string[]>(['']);

  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Cleanup object URLs when component unmounts or media uploads change
  useEffect(() => {
    return () => {
      // Cleanup any remaining object URLs to prevent memory leaks
      Object.values(mediaUploads).forEach(upload => {
        if (upload.file && headerType && headerType !== 'TEXT') {
          // The URLs are cleaned up by the onLoad/onLoadedData callbacks
          // This is just an additional safety measure
        }
      });
    };
  }, [mediaUploads, headerType]);

  // Get accepted file types based on media type
  const getAcceptedFileTypes = (mediaType: 'image' | 'video' | 'document') => {
    switch (mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'document':
        return '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
      default:
        return '*/*';
    }
  };

  // Handle file selection and auto-upload
  const handleFileSelect = async (uploadKey: string, file: File) => {
    // Set the file and start uploading immediately
    setMediaUploads(prev => ({
      ...prev,
      [uploadKey]: {
        file,
        uploading: true,
        uploaded: false,
        mediaHandle: null,
        error: null,
      },
    }));

    // Auto-upload the file using resumable API
    try {
      const resultAction = await dispatch(uploadMediaByResumableApiThunk(file));

      if (uploadMediaByResumableApiThunk.fulfilled.match(resultAction)) {
        const uploadedMediaHandle = resultAction.payload;

        // Update upload state to success
        setMediaUploads(prev => ({
          ...prev,
          [uploadKey]: {
            ...prev[uploadKey],
            uploading: false,
            uploaded: true,
            mediaHandle: uploadedMediaHandle ?? null,
            error: null,
          },
        }));
      } else {
        // Handle upload error
        const errorMessage =
          (resultAction.payload as string) || 'Upload failed';
        setMediaUploads(prev => ({
          ...prev,
          [uploadKey]: {
            ...prev[uploadKey],
            uploading: false,
            uploaded: false,
            error: errorMessage,
          },
        }));
      }
    } catch (error) {
      setMediaUploads(prev => ({
        ...prev,
        [uploadKey]: {
          ...prev[uploadKey],
          uploading: false,
          uploaded: false,
          error: 'Upload failed',
        },
      }));
    }
  };

  // Remove uploaded file
  const removeUploadedFile = (uploadKey: string) => {
    setMediaUploads(prev => {
      const newState = { ...prev };
      delete newState[uploadKey];
      return newState;
    });
  };

  // Render media upload component
  const renderMediaUpload = (
    uploadKey: string,
    mediaType: 'image' | 'video' | 'document',
    label: string
  ) => {
    const uploadState = mediaUploads[uploadKey];
    const acceptedTypes = getAcceptedFileTypes(mediaType);

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium">{label}</label>

        {!uploadState?.file ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </div>
              <input
                type="file"
                accept={acceptedTypes}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(uploadKey, file);
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-accent
                  "
              />
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  {uploadState.file.name}
                </div>
                <div className="text-xs text-gray-500">
                  ({(uploadState.file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeUploadedFile(uploadKey)}
                className="h-8 w-8 p-0"
                disabled={uploadState.uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploadState.error && (
              <div className="text-sm text-red-600 mb-2">
                {uploadState.error}
              </div>
            )}

            <div className="flex items-center gap-2">
              {uploadState.uploaded ? (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <Check className="h-4 w-4" />
                  Uploaded successfully
                </div>
              ) : uploadState.uploading ? (
                <div className="flex items-center gap-2 text-yellow-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              ) : uploadState.error ? (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Upload failed - {uploadState.error}
                </div>
              ) : null}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Upload your {mediaType} file. The file will be used as example media
          for the template.
        </p>
      </div>
    );
  };

  // Check if any media is currently uploading
  const isAnyMediaUploading = (): boolean => {
    return Object.values(mediaUploads).some(upload => upload.uploading);
  };

  const buildComponents = (): Component[] => {
    const components: Component[] = [];

    // Header component
    if (headerType) {
      const headerComponent: Component = {
        type: 'HEADER',
        format: headerType,
      };

      if (headerType === 'TEXT' && header.trim()) {
        headerComponent.text = header;

        // Add example for positional arguments in header
        const headerArgCount = countPositionalArgs(header);
        if (headerArgCount > 0) {
          const validExamples = headerExamples
            .filter(ex => ex.trim())
            .slice(0, headerArgCount);
          if (validExamples.length === headerArgCount) {
            headerComponent.example = {
              header_text: validExamples,
            };
          }
        }
      } else if (headerType !== 'TEXT') {
        // For media types, check if media is uploaded
        const uploadKey = `header-${headerType.toLowerCase()}`;
        const uploadState = mediaUploads[uploadKey];

        if (uploadState?.uploaded && uploadState.mediaHandle) {
          headerComponent.example = {
            header_handle: [uploadState.mediaHandle],
          };
        } else {
          // Use generic example handle if no media uploaded
          headerComponent.example = {
            header_handle: [`example_${headerType.toLowerCase()}_file`],
          };
        }
      }

      components.push(headerComponent);
    }

    // Body component (required)
    const bodyComponent: Component = {
      type: 'BODY',
      text: body,
    };

    // Add example for positional arguments in body
    const bodyArgCount = countPositionalArgs(body);
    if (bodyArgCount > 0) {
      const validExamples = bodyExamples
        .filter(ex => ex.trim())
        .slice(0, bodyArgCount);
      if (validExamples.length === bodyArgCount) {
        bodyComponent.example = {
          body_text: [validExamples],
        };
      }
    }

    components.push(bodyComponent);

    // Footer component
    if (footer.trim()) {
      components.push({
        type: 'FOOTER',
        text: footer,
      });
    }

    // Buttons component
    const buttons: TemplateButton[] = [];

    // Add URL buttons
    const validURLButtons = ctaButtons.filter(
      btn => btn.label.trim() && btn.url.trim()
    );
    validURLButtons.forEach(btn => {
      const button: TemplateButton = {
        type: 'URL',
        text: btn.label,
        url: btn.url,
      };

      // Add example if URL contains variables ({{1}} placeholder)
      if (btn.url.includes('{{1}}')) {
        button.example = { url: ['example-value'] };
      }

      buttons.push(button);
    });

    // Add phone button
    if (
      usePhoneButton &&
      phoneButton.label.trim() &&
      phoneButton.phone_number.trim()
    ) {
      buttons.push({
        type: 'PHONE_NUMBER',
        text: phoneButton.label,
        phone_number: phoneButton.phone_number,
      });
    }

    // Add quick reply buttons
    if (useQuickReply) {
      const validQuickReplies = quickReplyButtons.filter(btn => btn.trim());
      validQuickReplies.forEach(btn => {
        buttons.push({
          type: 'QUICK_REPLY',
          text: btn,
        });
      });
    }

    if (buttons.length > 0) {
      components.push({
        type: 'BUTTONS',
        buttons,
      });
    }

    return components;
  };

  const handleSubmit = async () => {
    const templateData: CreateTemplatePayload = {
      name: templateName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      category: templateCategory as 'AUTHENTICATION' | 'MARKETING' | 'UTILITY',
      language,
      components: buildComponents(),
    };

    try {
      await dispatch(createTemplateThunk(templateData)).unwrap();
      resetForm();
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateCategory('');
    setLanguage('');
    setHeaderType('');
    setHeader('');
    setBody('');
    setFooter('');
    setCtaButtons([{ label: '', url: '', type: 'URL' }]);
    setQuickReplyButtons(['']);
    setPhoneButton({ label: '', phone_number: '' });
    setUseQuickReply(false);
    setUsePhoneButton(false);
    setHeaderExamples(['']);
    setBodyExamples(['']);
    setValidationErrors({});
    setMediaUploads({});
  };

  const getGenericMediaPreview = () => {
    const uploadKey = `header-${headerType?.toLowerCase()}`;
    const uploadState = mediaUploads[uploadKey];

    // If no file is uploaded, show placeholder
    if (!uploadState?.file) {
      switch (headerType) {
        case 'IMAGE':
          return (
            <div className="rounded-md mb-2 h-32 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              🖼️ Sample Image
            </div>
          );
        case 'VIDEO':
          return (
            <div className="rounded-md mb-2 h-32 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              🎥 Sample Video
            </div>
          );
        case 'DOCUMENT':
          return (
            <div className="text-sm text-gray-800 font-medium mb-2 p-2 bg-gray-100 rounded">
              📄 sample_document.pdf
            </div>
          );
        default:
          return null;
      }
    }

    // Show actual uploaded media
    switch (headerType) {
      case 'IMAGE':
        const imageUrl = URL.createObjectURL(uploadState.file);
        return (
          <div className="rounded-md mb-2 max-h-32 w-full overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
              onLoad={() => {
                // Clean up the object URL after image loads to prevent memory leaks
                setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
              }}
            />
          </div>
        );

      case 'VIDEO':
        const videoUrl = URL.createObjectURL(uploadState.file);
        return (
          <div className="rounded-md mb-2 max-h-32 w-full overflow-hidden">
            <video
              src={videoUrl}
              className="w-full h-full object-cover rounded-md"
              controls
              muted
              onLoadedData={() => {
                // Clean up the object URL after video loads
                setTimeout(() => URL.revokeObjectURL(videoUrl), 1000);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'DOCUMENT':
        return (
          <div className="text-sm text-gray-800 font-medium mb-2 p-2 bg-gray-100 rounded flex items-center gap-2">
            <span className="text-lg">📄</span>
            <div className="flex-1 min-w-0">
              <div className="truncate">{uploadState.file.name}</div>
              <div className="text-xs text-gray-500">
                {(uploadState.file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const updateValidationErrors = (
    fieldName: string,
    value: any,
    additionalContext = {}
  ) => {
    const newErrors = validateField(fieldName, value, additionalContext);

    setValidationErrors(prev => {
      // Remove old errors for this field and related fields
      const updatedErrors: Record<string, string> = { ...prev };

      // Remove field-specific errors
      Object.keys(updatedErrors).forEach(key => {
        if (
          key.startsWith(fieldName) ||
          (fieldName === 'body' &&
            (key === 'bodyArgs' || key === 'bodyExamples')) ||
          (fieldName === 'header' &&
            (key === 'headerArgs' || key === 'headerExamples')) ||
          (fieldName === 'urlButton' && key.startsWith('url_btn_')) ||
          (fieldName === 'quickReply' &&
            (key.startsWith('quick_reply_') || key === 'quickReplyButtons')) ||
          (fieldName === 'phoneButton' && key.startsWith('phoneButton')) ||
          (['urlButton', 'quickReply', 'phoneButton'].includes(fieldName) &&
            key === 'totalButtons')
        ) {
          delete updatedErrors[key];
        }
      });

      // Ensure newErrors only contains string values (filter out undefined/null)
      const sanitizedNewErrors: Record<string, string> = Object.entries(
        newErrors
      ).reduce(
        (acc, [k, v]) => {
          if (v !== undefined && v !== null) {
            acc[k] = String(v);
          }
          return acc;
        },
        {} as Record<string, string>
      );

      // Add new errors
      return { ...updatedErrors, ...sanitizedNewErrors };
    });
  };

  const hasPreviewContent =
    !!headerType ||
    !!body ||
    !!footer ||
    ctaButtons.some(btn => btn.label && btn.url) ||
    quickReplyButtons.some(btn => btn.trim()) ||
    (usePhoneButton && phoneButton.label);

  return (
    <div className="flex flex-col h-full w-full ">
      <div className="flex h-20 shrink-0 items-center bg-primary gap-2 border-t-5 border-l-5 border-r-5 border-[#fafff4ff] text-accent transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <h1 className="text-xl font-medium">Create Template</h1>

          {/* Right section with button */}
          <div className="ml-auto flex items-center gap-2 ">
            <Link to="/dashboard/advertise/templates">
              <Button className="bg-accent text-primary hover:bg-accent/90">
                Back to Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="justify-items-start border-destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error creating template</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Input Fields */}
        <div className="w-2/3 p-6 rounded-b-2xl bg-card shadow-[0_0_10px_rgba(0,0,0,0.2)] ml-[5px] mt-4 mb-3 overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Template Name */}
            <div className="space-y-2 ">
              <div className="flex w-full items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Template Name
                </label>
                <Button
                  className="bg-primary text-accent hover:bg-primary/80 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={loading || isAnyMediaUploading()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : isAnyMediaUploading() ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading media...
                    </>
                  ) : (
                    'Send to Review'
                  )}
                </Button>
              </div>
              <Input
                placeholder="my_template_name (lowercase, numbers, underscores only)"
                value={templateName}
                onChange={e => {
                  const value = e.target.value;
                  setTemplateName(value);
                  updateValidationErrors('templateName', value);
                }}
                className={
                  validationErrors.templateName ? 'border-red-500' : ''
                }
              />
              {validationErrors.templateName && (
                <p className="text-red-500 text-sm">
                  {validationErrors.templateName}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Must contain only lowercase letters, numbers, and underscores
              </p>
            </div>

            {/* Category */}
            <div className="space-x-8 flex flex-1 mt-8 mb-14">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                  Category{' '}
                </label>
                <Select
                  value={templateCategory}
                  onValueChange={(
                    value: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY'
                  ) => {
                    setTemplateCategory(value);
                    updateValidationErrors('templateCategory', value);
                  }}
                >
                  <SelectTrigger
                    className={`h-11 w-full rounded-lg border  px-3 text-sm 
    text-gray-700 shadow-sm transition-all focus:ring-2 focus:ring-primary 
    focus:border-primary/70 hover:border-primary/40 
    ${validationErrors.templateCategory ? 'border-red-500' : 'border-gray-100'}`}
                  >
                    <SelectValue
                      placeholder="Select Category"
                      className="text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="UTILITY">Utility</SelectItem>
                    <SelectItem value="AUTHENTICATION">
                      Authentication
                    </SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.templateCategory && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.templateCategory}
                  </p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                  Language{' '}
                </label>
                <Select
                  value={language}
                  onValueChange={value => {
                    setLanguage(value);
                    updateValidationErrors('language', value);
                  }}
                >
                  <SelectTrigger
                    className={`h-11 w-full rounded-lg border  px-3 text-sm 
      text-gray-700 shadow-sm transition-all focus:ring-2 focus:ring-primary 
      focus:border-primary/70 hover:border-primary/40
      ${validationErrors.language ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <SelectValue
                      placeholder="Select Language"
                      className="text-gray-400"
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {' '}
                    <SelectItem value="en_US">English (US)</SelectItem>{' '}
                    <SelectItem value="hi">Hindi</SelectItem>{' '}
                  </SelectContent>
                </Select>
                {validationErrors.language && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.language}
                  </p>
                )}
              </div>

              {/* Header Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                  Header Type (Optional)
                </label>
                <Select
                  value={headerType}
                  onValueChange={(value: HeaderFormat) => {
                    setHeaderType(value);
                    // Reset header text when changing type
                    if (value !== 'TEXT') {
                      setHeader('');
                      setHeaderExamples(['']);
                    }
                    // Clear media uploads when changing type
                    setMediaUploads({});
                    updateValidationErrors('headerType', value);
                  }}
                >
                  <SelectTrigger
                    className={`h-11 w-full rounded-lg   px-3 text-sm 
      text-gray-700 shadow-sm transition-all focus:ring-2 focus:ring-primary 
      focus:border-primary/70 hover:border-primary/40
      ${validationErrors.headerType ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <SelectValue
                      placeholder="Select Header Type"
                      className="text-gray-400"
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {' '}
                    <SelectItem value="TEXT">Text</SelectItem>{' '}
                    <SelectItem value="IMAGE">Image</SelectItem>{' '}
                    <SelectItem value="VIDEO">Video</SelectItem>{' '}
                    <SelectItem value="DOCUMENT">Document</SelectItem>{' '}
                  </SelectContent>
                </Select>
                {validationErrors.headerType && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.headerType}
                  </p>
                )}
              </div>
            </div>

            {/* Header Message - Only show for TEXT type */}
            {headerType === 'TEXT' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Header Message
                </label>
                <Input
                  placeholder="Header Message (max 60 characters). Use only {{1}} for variable"
                  value={header}
                  onChange={e => {
                    const value = e.target.value;
                    setHeader(value);
                    updateValidationErrors('header', value, { headerExamples });

                    // Auto-adjust example fields based on positional args (max 1 for header)
                    const argCount = countPositionalArgs(value);
                    if (argCount > 0 && argCount <= 1) {
                      setHeaderExamples(['']);
                    } else if (argCount === 0) {
                      setHeaderExamples([]);
                    }
                  }}
                  maxLength={60}
                  className={
                    validationErrors.header || validationErrors.headerArgs
                      ? 'border-red-500'
                      : ''
                  }
                />
                {validationErrors.header && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.header}
                  </p>
                )}
                {validationErrors.headerArgs && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.headerArgs}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {header.length}/60 characters
                </p>

                {/* Header Examples for Positional Arguments (only {{1}} allowed) */}
                {countPositionalArgs(header) === 1 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-yellow-600">
                      <Info className="w-4 h-4 inline mr-1" />
                      Header Example Value for {'{{1}}'}
                    </label>
                    <Input
                      placeholder="Example value for {{1}}"
                      value={headerExamples[0] || ''}
                      onChange={e => {
                        const newExamples = [e.target.value];
                        setHeaderExamples(newExamples);
                        updateValidationErrors('header', header, {
                          headerExamples: newExamples,
                        });
                      }}
                      className={
                        validationErrors.headerExamples ? 'border-red-500' : ''
                      }
                    />
                    {validationErrors.headerExamples && (
                      <p className="text-red-500 text-sm">
                        {validationErrors.headerExamples}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Media Upload Section for non-TEXT header types */}
            {headerType && headerType !== 'TEXT' && (
              <div className="space-y-2 block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                {renderMediaUpload(
                  `header-${headerType.toLowerCase()}`,
                  headerType.toLowerCase() as 'image' | 'video' | 'document',
                  `Header ${headerType.charAt(0) + headerType.slice(1).toLowerCase()} (Optional)`
                )}
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                  <Info className="w-4 h-4 inline mr-1" />
                  Upload example media for your template. This will be used as a
                  reference when creating campaigns with this template.
                </div>
              </div>
            )}

            {/* Body Message */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Body Message
              </label>
              <Textarea
                placeholder="Body Message (max 1024 characters). Use {{1}}, {{2}} for variables"
                value={body}
                onChange={e => {
                  const value = e.target.value;
                  setBody(value);

                  // Auto-adjust example fields based on positional args
                  const argCount = countPositionalArgs(value);
                  let newBodyExamples = bodyExamples;
                  if (argCount !== bodyExamples.length) {
                    newBodyExamples = Array(argCount)
                      .fill('')
                      .concat(bodyExamples.slice(argCount));
                    setBodyExamples(newBodyExamples);
                  }

                  updateValidationErrors('body', value, {
                    bodyExamples: newBodyExamples,
                  });
                }}
                maxLength={1024}
                className={validationErrors.body ? 'border-red-500' : ''}
                rows={4}
              />
              {validationErrors.body && (
                <p className="text-red-500 text-sm">{validationErrors.body}</p>
              )}
              {validationErrors.bodyArgs && (
                <p className="text-red-500 text-sm">
                  {validationErrors.bodyArgs}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {body.length}/1024 characters
              </p>

              {/* Body Examples for Positional Arguments */}
              {countPositionalArgs(body) > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-yellow-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    Body Example Values ({countPositionalArgs(body)} required)
                  </label>
                  {Array.from(
                    { length: countPositionalArgs(body) },
                    (_, index) => (
                      <Input
                        key={index}
                        placeholder={`Example value for {{${index + 1}}}`}
                        value={bodyExamples[index] || ''}
                        onChange={e => {
                          const updated = [...bodyExamples];
                          updated[index] = e.target.value;
                          setBodyExamples(updated);
                          updateValidationErrors('body', body, {
                            bodyExamples: updated,
                          });
                        }}
                        className={
                          validationErrors.bodyExamples ? 'border-red-500' : ''
                        }
                      />
                    )
                  )}
                  {validationErrors.bodyExamples && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.bodyExamples}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Message */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Footer Message (Optional)
              </label>
              <Input
                placeholder="Footer Message (max 60 characters)"
                value={footer}
                onChange={e => {
                  const value = e.target.value;
                  setFooter(value);
                  updateValidationErrors('footer', value);
                }}
                maxLength={60}
                className={validationErrors.footer ? 'border-red-500' : ''}
              />
              {validationErrors.footer && (
                <p className="text-red-500 text-sm">
                  {validationErrors.footer}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {footer.length}/60 characters
              </p>
            </div>

            {/* Button Types Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Buttons (Optional)
              </label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 block font-semibold text-gray-700 tracking-wide ">
                  <input
                    type="checkbox"
                    checked={useQuickReply}
                    onChange={e => {
                      setUseQuickReply(e.target.checked);
                      updateValidationErrors('quickReply', e.target.checked);
                    }}
                  />
                  Quick Reply Buttons
                </label>
                <label className="flex items-center gap-2 block font-semibold text-gray-700 tracking-wide">
                  <input
                    type="checkbox"
                    checked={usePhoneButton}
                    onChange={e => {
                      setUsePhoneButton(e.target.checked);
                      updateValidationErrors('phoneButton', e.target.checked);
                    }}
                  />
                  Phone Button
                </label>
              </div>

              <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                <Info className="w-4 h-4 inline mr-1" />
                You can now combine URL buttons with quick reply buttons and
                phone buttons. Max 2 URL buttons, max 3 quick reply when
                combined with others (10 when standalone), and 1 phone button.
              </div>

              {/* URL Buttons */}
              <div className="space-y-3">
                <h4 className="block text-md font-semibold text-gray-700 tracking-wide mb-2">
                  URL Buttons (Max 2)
                </h4>
                {ctaButtons.map((cta, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto] gap-4 items-start"
                  >
                    <div>
                      <Input
                        placeholder="Button Label (max 25 chars)"
                        value={cta.label}
                        onChange={e => {
                          const updated = [...ctaButtons];
                          updated[index].label = e.target.value;
                          setCtaButtons(updated);
                          updateValidationErrors('urlButton', updated);
                        }}
                        maxLength={25}
                        className={
                          validationErrors[`url_btn_${index}_label`]
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {validationErrors[`url_btn_${index}_label`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors[`url_btn_${index}_label`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        placeholder="https://... (use {{1}} for dynamic values)"
                        value={cta.url}
                        onChange={e => {
                          const updated = [...ctaButtons];
                          updated[index].url = e.target.value;
                          setCtaButtons(updated);
                          updateValidationErrors('urlButton', updated);
                        }}
                        className={
                          validationErrors[`url_btn_${index}_url`]
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {validationErrors[`url_btn_${index}_url`] && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors[`url_btn_${index}_url`]}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start justify-center mt-[3px]">
                      {index === 0 ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            if (ctaButtons.length >= 2) {
                              setShowLimitDialog(true);
                            } else {
                              const updated = [
                                ...ctaButtons,
                                {
                                  label: '',
                                  url: '',
                                  type: 'URL' as ButtonType,
                                },
                              ];
                              setCtaButtons(updated);
                              updateValidationErrors('urlButton', updated);
                            }
                          }}
                          disabled={ctaButtons.length >= 2}
                        >
                          + Add
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = ctaButtons.filter(
                              (_, i) => i !== index
                            );
                            setCtaButtons(updated);
                            updateValidationErrors('urlButton', updated);
                          }}
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {validationErrors.urlButtons && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.urlButtons}
                  </p>
                )}
              </div>

              {/* Quick Reply Buttons */}
              {useQuickReply && (
                <div className="space-y-3">
                  <h4 className="block text-md font-semibold text-gray-700 tracking-wide mb-2">
                    Quick Reply Buttons
                    {ctaButtons.filter(btn => btn.label && btn.url).length >
                      0 || usePhoneButton
                      ? ' (Max 3 when combined)'
                      : ' (Max 10 when standalone)'}
                  </h4>
                  {quickReplyButtons.map((btn, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <Input
                        placeholder="Quick Reply Text (max 25 chars)"
                        value={btn}
                        onChange={e => {
                          const updated = [...quickReplyButtons];
                          updated[index] = e.target.value;
                          setQuickReplyButtons(updated);
                          updateValidationErrors('quickReply', updated);
                        }}
                        maxLength={25}
                        className={
                          validationErrors[`quick_reply_${index}`]
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {validationErrors[`quick_reply_${index}`] && (
                        <p className="text-red-500 text-xs">
                          {validationErrors[`quick_reply_${index}`]}
                        </p>
                      )}
                      <div className="flex mt-[3px] gap-2">
                        {index === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              const hasOtherButtons =
                                ctaButtons.filter(btn => btn.label && btn.url)
                                  .length > 0 || usePhoneButton;
                              const maxButtons = hasOtherButtons ? 3 : 10;

                              if (quickReplyButtons.length >= maxButtons) {
                                setShowLimitDialog(true);
                              } else {
                                const updated = [...quickReplyButtons, ''];
                                setQuickReplyButtons(updated);
                                updateValidationErrors('quickReply', updated);
                              }
                            }}
                            disabled={
                              ctaButtons.filter(btn => btn.label && btn.url)
                                .length > 0 || usePhoneButton
                                ? quickReplyButtons.length >= 3
                                : quickReplyButtons.length >= 10
                            }
                          >
                            + Add
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updated = quickReplyButtons.filter(
                                (_, i) => i !== index
                              );
                              setQuickReplyButtons(updated);
                              updateValidationErrors('quickReply', updated);
                            }}
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {validationErrors.quickReplyButtons && (
                    <p className="text-red-500 text-sm">
                      {validationErrors.quickReplyButtons}
                    </p>
                  )}
                </div>
              )}

              {/* Phone Button */}
              {usePhoneButton && (
                <div className="space-y-3">
                  <h4 className="block text-md font-semibold text-gray-700 tracking-wide mb-2">
                    Phone Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Button Label (max 25 chars)"
                        value={phoneButton.label}
                        onChange={e => {
                          setPhoneButton(prev => ({
                            ...prev,
                            label: e.target.value,
                          }));
                          updateValidationErrors('phoneButton', true);
                        }}
                        maxLength={25}
                        className={
                          validationErrors.phoneButtonLabel
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {validationErrors.phoneButtonLabel && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.phoneButtonLabel}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="+1234567890 (max 20 chars)"
                        value={phoneButton.phone_number}
                        onChange={e => {
                          setPhoneButton(prev => ({
                            ...prev,
                            phone_number: e.target.value,
                          }));
                          updateValidationErrors('phoneButton', true);
                        }}
                        maxLength={20}
                        className={
                          validationErrors.phoneButtonNumber
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {validationErrors.phoneButtonNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationErrors.phoneButtonNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.totalButtons && (
                <p className="text-red-500 text-sm">
                  {validationErrors.totalButtons}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - WhatsApp Preview */}
        <div
          className="flex-1 rounded-b-2xl shadow-[0_0_10px_rgba(0,0,0,0.2)]  bg-card p-4 ml-2 mb-3 mt-4 mr-[5px]  flex  justify-center"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="bg-[#ece5dd] w-[260px] h-[500px] mt-10 rounded-2xl shadow-lg border overflow-hidden relative flex flex-col border-5 border-black">
            {/* Top bar */}
            <div className="bg-[#075e54] text-white px-4 py-2 text-sm font-medium">
              WhatsApp Preview
            </div>

            {/* Message preview */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div
                className={`bg-white rounded-lg text-sm max-w-xs ml-2 shadow-md transition-all duration-300 m-6 flex flex-col ${
                  hasPreviewContent ? 'px-4 py-3' : 'px-2 py-1 text-gray-400'
                }`}
              >
                {hasPreviewContent ? (
                  <>
                    {/* Media Preview - Show actual media based on header type */}
                    {headerType &&
                      headerType !== 'TEXT' &&
                      getGenericMediaPreview()}

                    {/* Header Text with Variables Rendered */}
                    {headerType === 'TEXT' && header && (
                      <div className="font-semibold text-sm mb-2 break-words">
                        {countPositionalArgs(header) > 0
                          ? renderTextWithArgs(
                              header,
                              headerExamples.filter(ex => ex.trim())
                            )
                          : header}
                      </div>
                    )}

                    {/* Body with Variables Rendered */}
                    {body && (
                      <div className="text-gray-800 whitespace-pre-wrap break-words mb-2">
                        {countPositionalArgs(body) > 0
                          ? renderTextWithArgs(
                              body,
                              bodyExamples.filter(ex => ex.trim())
                            )
                          : body}
                      </div>
                    )}

                    {/* Footer */}
                    {footer && (
                      <div className="text-gray-600 text-xs mt-1 mb-2 break-words">
                        {footer}
                      </div>
                    )}

                    {/* Buttons */}
                    {(ctaButtons.filter(btn => btn.label && btn.url).length >
                      0 ||
                      (useQuickReply &&
                        quickReplyButtons.filter(btn => btn.trim()).length >
                          0) ||
                      (usePhoneButton && phoneButton.label)) && (
                      <>
                        <hr className="border-t border-gray-300 mt-2 mb-2" />
                        <div className="space-y-2">
                          {/* URL Buttons */}
                          {ctaButtons
                            .filter(btn => btn.label && btn.url)
                            .map((btn, idx) => (
                              <div key={idx} className="text-center">
                                <button className="inline-flex items-center gap-2 text-[#25D366] text-sm font-medium px-3 py-1 border border-[#25D366] rounded hover:bg-[#25D366]/10">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-3 h-3"
                                  >
                                    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3Z" />
                                  </svg>
                                  {btn.label}
                                </button>
                              </div>
                            ))}

                          {/* Quick Reply Buttons */}
                          {useQuickReply &&
                            quickReplyButtons
                              .filter(btn => btn.trim())
                              .map((btn, idx) => (
                                <div key={idx} className="text-center">
                                  <button className="text-[#25D366] text-sm font-medium px-3 py-1 border border-[#25D366] rounded bg-[#25D366]/5 hover:bg-[#25D366]/10">
                                    {btn}
                                  </button>
                                </div>
                              ))}

                          {/* Phone Button */}
                          {usePhoneButton && phoneButton.label && (
                            <div className="text-center">
                              <button className="inline-flex items-center gap-2 text-[#25D366] text-sm font-medium px-3 py-1 border border-[#25D366] rounded hover:bg-[#25D366]/10">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-3 h-3"
                                >
                                  <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                {phoneButton.label}
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <span>Message preview will appear here</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Button Limit Reached</DialogTitle>
          </DialogHeader>
          <p>
            You have reached the maximum number of buttons allowed for this
            type.
          </p>
          <DialogFooter>
            <Button onClick={() => setShowLimitDialog(false)}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

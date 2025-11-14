/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type JSX } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  Info,
  Users,
  MessageSquare,
  Upload,
  X,
  Check,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type {
  CreateCampaignPayload,
  TextParameter,
  TemplateObject,
  MessageParameter,
  ImageParameter,
  VideoParameter,
  DocumentParameter,
  UrlButtonParameter,
} from '@/types/campaign';
import {
  fetchAllTemplatesThunk,
  fetchTemplateByIdThunk,
  clearSelectedTemplate,
} from '@/store/slices/templateSlice';
import { fetchAllGroupsThunk } from '@/store/slices/groupSlice';
import { createCampaignThunk } from '@/store/slices/campiagnSlice';
import { uploadMediaThunk, clearMediaState } from '@/store/slices/mediaSlice';
import type { Component } from '@/types/template';

// Interface for template parameters collected from user
interface TemplateParams {
  header?: { [key: string]: string };
  body?: { [key: string]: string };
  buttons?: { [key: string]: string };
}

// Interface for media upload states
interface MediaUploadState {
  [key: string]: {
    file: File | null;
    uploading: boolean;
    uploaded: boolean;
    mediaId: string | null;
    error: string | null;
  };
}

export default function CreateCampaign() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.campaign);
  const { templates, selectedTemplate } = useAppSelector(
    state => state.template
  );
  const { groups } = useAppSelector(state => state.group);

  const [formData, setFormData] = useState({
    name: '',
    groupId: '',
    templateId: '',
  });

  const [templateParams, setTemplateParams] = useState<TemplateParams>({});
  const [mediaUploads, setMediaUploads] = useState<MediaUploadState>({});

  useEffect(() => {
    dispatch(fetchAllTemplatesThunk());
    dispatch(fetchAllGroupsThunk());
    dispatch(clearSelectedTemplate());
  }, [dispatch]);

  // Handle form field changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string): void => {
    setFormData(prev => ({
      ...prev,
      templateId,
    }));
    setTemplateParams({});
    setMediaUploads({});
    dispatch(clearMediaState());

    if (templateId) {
      dispatch(fetchTemplateByIdThunk(templateId));
    }
  };

  // Update template parameters
  const updateTemplateParam = (
    section: keyof TemplateParams,
    key: string,
    value: string
  ): void => {
    setTemplateParams(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // Handle file selection and auto-upload
  const handleFileSelect = async (
    uploadKey: string,
    file: File,
    mediaType: 'image' | 'video' | 'document'
  ) => {
    // Set the file and start uploading immediately
    setMediaUploads(prev => ({
      ...prev,
      [uploadKey]: {
        file,
        uploading: true,
        uploaded: false,
        mediaId: null,
        error: null,
      },
    }));

    // Auto-upload the file
    try {
      const resultAction = await dispatch(uploadMediaThunk(file));

      if (uploadMediaThunk.fulfilled.match(resultAction)) {
        const uploadedMediaId = resultAction.payload;

        // Update upload state to success
        setMediaUploads(prev => ({
          ...prev,
          [uploadKey]: {
            ...prev[uploadKey],
            uploading: false,
            uploaded: true,
            mediaId: uploadedMediaId ?? null,
            error: null,
          },
        }));

        // Set the media ID in template parameters
        const paramKey =
          mediaType === 'image'
            ? 'image_id'
            : mediaType === 'video'
              ? 'video_id'
              : 'document_id';
        updateTemplateParam('header', paramKey, uploadedMediaId ?? '');
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
  const removeUploadedFile = (
    uploadKey: string,
    mediaType: 'image' | 'video' | 'document'
  ) => {
    setMediaUploads(prev => {
      const newState = { ...prev };
      delete newState[uploadKey];
      return newState;
    });

    // Clear the media ID from template parameters
    const paramKey =
      mediaType === 'image'
        ? 'image_id'
        : mediaType === 'video'
          ? 'video_id'
          : 'document_id';
    updateTemplateParam('header', paramKey, '');
  };

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

  // Render media upload component
  const renderMediaUpload = (
    uploadKey: string,
    mediaType: 'image' | 'video' | 'document',
    label: string
  ): JSX.Element => {
    const uploadState = mediaUploads[uploadKey];
    const acceptedTypes = getAcceptedFileTypes(mediaType);

    return (
      <div className="space-y-3">
        <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
          {label} *
        </Label>

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
                    handleFileSelect(uploadKey, file, mediaType);
                  }
                }}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-accent
                  hover:file:bg-yellow-100"
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
                onClick={() => removeUploadedFile(uploadKey, mediaType)}
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

            {uploadState.uploaded && uploadState.mediaId && (
              <div className="mt-2 text-xs text-gray-500">
                Media ID: {uploadState.mediaId}
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500">
          Upload your {mediaType} file. The media ID will be automatically set
          after upload.
        </p>
      </div>
    );
  };

  // Render header inputs
  const renderHeaderInputs = (
    component: Component,
    componentIndex: number
  ): JSX.Element | null => {
    if (component.format === 'IMAGE' && component.example?.header_handle) {
      const uploadKey = `header-image-${componentIndex}`;
      return (
        <div key={`header-${componentIndex}`} className="space-y-2">
          {renderMediaUpload(uploadKey, 'image', 'Header Image')}
        </div>
      );
    }

    if (component.format === 'TEXT' && component.example?.header_text) {
      const headerParams = component.example.header_text || [];
      return (
        <div key={`header-${componentIndex}`} className="space-y-3">
          <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Header Parameters
          </Label>
          {headerParams.map((example, index) => (
            <div key={`header-param-${index}`} className="space-y-2">
              <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Header Parameter {index + 1} *
              </Label>
              <Input
                type="text"
                placeholder={`Example: ${example}`}
                onChange={e =>
                  updateTemplateParam(
                    'header',
                    index.toString(),
                    e.target.value
                  )
                }
              />
            </div>
          ))}
        </div>
      );
    }

    if (component.format === 'VIDEO' && component.example?.header_handle) {
      const uploadKey = `header-video-${componentIndex}`;
      return (
        <div key={`header-${componentIndex}`} className="space-y-2">
          {renderMediaUpload(uploadKey, 'video', 'Header Video')}
        </div>
      );
    }

    if (component.format === 'DOCUMENT' && component.example?.header_handle) {
      const uploadKey = `header-document-${componentIndex}`;
      return (
        <div key={`header-${componentIndex}`} className="space-y-3">
          {renderMediaUpload(uploadKey, 'document', 'Header Document')}
          <div className="space-y-2">
            <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Document Filename (Optional)
            </Label>
            <Input
              type="text"
              placeholder="document.pdf"
              onChange={e =>
                updateTemplateParam(
                  'header',
                  'document_filename',
                  e.target.value
                )
              }
            />
          </div>
        </div>
      );
    }

    return null;
  };

  // Render body inputs
  const renderBodyInputs = (
    component: Component,
    componentIndex: number
  ): JSX.Element | null => {
    if (!component.example?.body_text?.[0]) return null;

    const exampleValues = component.example.body_text[0];

    return (
      <div key={`body-${componentIndex}`} className="space-y-3">
        <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
          Body Parameters
        </Label>
        <div className="p-3 bg-yellow-50 rounded-md">
          <p className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
            Template Preview:
          </p>
          <p className="text-sm text-yellow-600 mt-1">{component.text}</p>
        </div>
        {exampleValues.map((example, index) => (
          <div key={`body-param-${index}`} className="space-y-2">
            <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
              Parameter {index + 1} *
            </Label>
            <Input
              type="text"
              placeholder={`Example: ${example}`}
              onChange={e =>
                updateTemplateParam('body', index.toString(), e.target.value)
              }
            />
            <p className="text-xs text-gray-500">
              This will replace {`{{${index + 1}}}`} in the template
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Render button inputs
  const renderButtonInputs = (
    component: Component,
    componentIndex: number
  ): JSX.Element | null => {
    if (!component.buttons) return null;

    const urlButtons = component.buttons.filter(
      button => button.type === 'URL' && button.url && button.url.includes('{{')
    );

    if (urlButtons.length === 0) return null;

    return (
      <div key={`buttons-${componentIndex}`} className="space-y-3">
        <Label className="text-sm font-medium">Button Parameters</Label>
        {component.buttons.map((button, buttonIndex) => {
          if (
            button.type === 'URL' &&
            button.url &&
            button.url.includes('{{')
          ) {
            return (
              <div key={`button-${buttonIndex}`} className="space-y-2">
                <Label className="text-sm font-medium">
                  URL Parameter for "{button.text}" *
                </Label>
                <Input
                  type="text"
                  placeholder="Enter the dynamic URL part"
                  onChange={e =>
                    updateTemplateParam(
                      'buttons',
                      buttonIndex.toString(),
                      e.target.value
                    )
                  }
                />
                <p className="text-xs text-gray-500">
                  Base URL: {button.url.split('{{')[0]}
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Main component input renderer
  const renderComponentInputs = (
    component: Component,
    componentIndex: number
  ): JSX.Element | null => {
    switch (component.type) {
      case 'HEADER':
        return renderHeaderInputs(component, componentIndex);
      case 'BODY':
        return renderBodyInputs(component, componentIndex);
      case 'BUTTONS':
        return renderButtonInputs(component, componentIndex);
      case 'FOOTER':
        return (
          <div key={`footer-${componentIndex}`} className="space-y-2">
            <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2m">
              Footer
            </Label>
            <div className="p-2  rounded text-sm text-primary">
              {component.text}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Create template object according to your types
  const createTemplateObject = (): TemplateObject | null => {
    if (!selectedTemplate || !templateParams) return null;

    const components: any[] = [];

    // Process each component in the template
    selectedTemplate?.components?.forEach(component => {
      switch (component.type) {
        case 'HEADER':
          if (templateParams.header) {
            const parameters: MessageParameter[] = [];

            if (
              component.format === 'IMAGE' &&
              templateParams.header.image_id
            ) {
              const imageParam: ImageParameter = {
                type: 'image',
                image: {
                  id: templateParams.header.image_id,
                },
              };
              parameters.push(imageParam);
            } else if (
              component.format === 'VIDEO' &&
              templateParams.header.video_id
            ) {
              const videoParam: VideoParameter = {
                type: 'video',
                video: {
                  id: templateParams.header.video_id,
                },
              };
              parameters.push(videoParam);
            } else if (
              component.format === 'DOCUMENT' &&
              templateParams.header.document_id
            ) {
              const documentParam: DocumentParameter = {
                type: 'document',
                document: {
                  id: templateParams.header.document_id,
                  ...(templateParams.header.document_filename && {
                    filename: templateParams.header.document_filename,
                  }),
                },
              };
              parameters.push(documentParam);
            } else if (component.format === 'TEXT') {
              Object.entries(templateParams.header).forEach(([key, value]) => {
                if (value && typeof value === 'string' && !isNaN(Number(key))) {
                  const textParam: TextParameter = {
                    type: 'text',
                    text: value,
                  };
                  parameters.push(textParam);
                }
              });
            }

            if (parameters.length > 0) {
              components.push({
                type: 'header',
                parameters,
              });
            }
          }
          break;

        case 'BODY':
          if (templateParams.body) {
            const parameters: TextParameter[] = [];

            // Sort by numeric keys to maintain parameter order
            const sortedEntries = Object.entries(templateParams.body)
              .filter(
                ([key, value]) =>
                  value && typeof value === 'string' && !isNaN(Number(key))
              )
              .sort(([a], [b]) => Number(a) - Number(b));

            sortedEntries.forEach(([, value]) => {
              parameters.push({
                type: 'text',
                text: value,
              });
            });

            if (parameters.length > 0) {
              components.push({
                type: 'body',
                parameters,
              });
            }
          }
          break;

        case 'BUTTONS':
          if (templateParams.buttons) {
            Object.entries(templateParams.buttons).forEach(
              ([buttonIndex, value]) => {
                if (value) {
                  const urlParam: UrlButtonParameter = {
                    type: 'text',
                    text: value,
                  };

                  components.push({
                    type: 'button',
                    sub_type: 'url',
                    index: parseInt(buttonIndex),
                    parameters: [urlParam],
                  });
                }
              }
            );
          }
          break;

        default:
          break;
      }
    });

    return {
      name: selectedTemplate.name,
      language: {
        code: selectedTemplate.language || 'en_US',
      },
      components: components.length > 0 ? components : undefined,
    };
  };

  // Validation function to check if all required fields are filled
  const isFormValid = (): boolean => {
    // Check basic form fields
    if (!formData.name.trim() || !formData.groupId || !formData.templateId) {
      return false;
    }

    // If no template is selected, can't proceed
    if (!selectedTemplate) return false;

    // Check template parameters if they exist
    if (templateHasParameters && selectedTemplate.components) {
      for (const component of selectedTemplate.components) {
        switch (component.type) {
          case 'HEADER':
            if (
              component.format === 'IMAGE' &&
              component.example?.header_handle
            ) {
              const uploadKey = 'header-image-0';
              const uploadState = mediaUploads[uploadKey];
              if (!uploadState?.uploaded || !uploadState.mediaId) {
                return false;
              }
            } else if (
              component.format === 'VIDEO' &&
              component.example?.header_handle
            ) {
              const uploadKey = 'header-video-0';
              const uploadState = mediaUploads[uploadKey];
              if (!uploadState?.uploaded || !uploadState.mediaId) {
                return false;
              }
            } else if (
              component.format === 'DOCUMENT' &&
              component.example?.header_handle
            ) {
              const uploadKey = 'header-document-0';
              const uploadState = mediaUploads[uploadKey];
              if (!uploadState?.uploaded || !uploadState.mediaId) {
                return false;
              }
            } else if (
              component.format === 'TEXT' &&
              component.example?.header_text
            ) {
              const headerParams = component.example.header_text;
              for (let i = 0; i < headerParams.length; i++) {
                if (!templateParams.header?.[i.toString()]?.trim()) {
                  return false;
                }
              }
            }
            break;

          case 'BODY':
            if (component.example?.body_text?.[0]) {
              const bodyParams = component.example.body_text[0];
              for (let i = 0; i < bodyParams.length; i++) {
                if (!templateParams.body?.[i.toString()]?.trim()) {
                  return false;
                }
              }
            }
            break;

          case 'BUTTONS':
            if (component.buttons) {
              const urlButtons = component.buttons.filter(
                button =>
                  button.type === 'URL' &&
                  button.url &&
                  button.url.includes('{{')
              );
              for (let i = 0; i < urlButtons.length; i++) {
                if (!templateParams.buttons?.[i.toString()]?.trim()) {
                  return false;
                }
              }
            }
            break;
        }
      }
    }

    return true;
  };

  // Check if any media is currently uploading
  const isAnyMediaUploading = (): boolean => {
    return Object.values(mediaUploads).some(upload => upload.uploading);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const templateObject = createTemplateObject();
    if (!templateObject) {
      console.error('Template object is not ready');
      return;
    }

    const campaignData: CreateCampaignPayload = {
      name: formData.name,
      groupId: formData.groupId,
      templateId: formData.templateId,
      templateObject,
    };

    try {
      await dispatch(createCampaignThunk(campaignData)).unwrap();
      // Reset form on success
      setFormData({ name: '', groupId: '', templateId: '' });
      setTemplateParams({});
      setMediaUploads({});
      dispatch(clearMediaState());
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  // Check if template has parameters
  const templateHasParameters = selectedTemplate?.components?.some(
    component =>
      (component.type === 'HEADER' &&
        ((component.format === 'TEXT' && component.example?.header_text) ||
          component.format === 'IMAGE' ||
          component.format === 'VIDEO' ||
          component.format === 'DOCUMENT')) ||
      (component.type === 'BODY' && component.example?.body_text?.[0]) ||
      (component.type === 'BUTTONS' &&
        component.buttons?.some(
          btn => btn.type === 'URL' && btn.url && btn.url.includes('{{')
        ))
  );

  return (
    <div className="flex flex-col h-full w-full ">
      {/* Header */}
      <div className="flex h-20 shrink-0 bg-primary gap-2 border-t-5 border-l-5 border-r-5 border-[#fafff4ff] text-accent transition-[width,height] ease-linear">
        <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6">
          {/* Left Section with Title */}
          <div className="flex items-center gap-2">
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <h1 className="text-xl font-medium">Create Campaign</h1>
          </div>

          {/* Right Section with Button */}
          <Link to="/dashboard/advertise/broadcast">
            <Button className="bg-accent text-primary hover:bg-accent/90">
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error creating campaign</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Input Fields */}
        <div className="w-2/3 p-6 bg-card overflow-y-auto space-y-4  rounded-b-2xl shadow-[0_0_10px_rgba(0,0,0,0.2)] mt-3 mb-3 ml-[5px]">
          <form
            id="campaign-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Campaign Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="block text-sm font-semibold text-gray-700 tracking-wide ">
                  Campaign Name
                </Label>
                <Button
                  className="s disabled:opacity-100"
                  onClick={() =>
                    document
                      .getElementById('campaign-form')
                      ?.dispatchEvent(new Event('submit', { bubbles: true }))
                  }
                  disabled={loading || !isFormValid() || isAnyMediaUploading()}
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
                    'Create Campaign'
                  )}
                </Button>
              </div>
              <Input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Enter campaign name"
              />
              <p className="text-xs text-gray-500">
                Campaign name should be descriptive and unique
              </p>
            </div>

            {/* Group Selection */}
            <div className="space-y-2">
              <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Select Group
              </Label>
              <Select
                value={formData.groupId}
                onValueChange={value => handleInputChange('groupId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{group.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select the target group for this campaign
              </p>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label className="block text-sm font-semibold text-gray-700 tracking-wide mb-2">
                Select Template
              </Label>
              <Select
                value={formData.templateId}
                onValueChange={handleTemplateSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge
                          variant={
                            template.status === 'APPROVED'
                              ? 'default'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {template.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Only approved templates can be used for campaigns
              </p>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">
                    Selected Template: {selectedTemplate.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{selectedTemplate.category}</Badge>
                  <Badge variant="outline">{selectedTemplate.language}</Badge>
                  <Badge
                    variant={
                      selectedTemplate.status === 'APPROVED'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {selectedTemplate.status}
                  </Badge>
                </div>
              </div>
            )}

            {/* Dynamic Template Parameters */}
            {selectedTemplate && templateHasParameters && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="block text-lg font-semibold text-gray-700 tracking-wide mb-2 mt-2">
                    Template Parameters
                  </h3>
                  <Info className="w-4 h-4 text-yellow-600 mt-[2px]" />
                </div>
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                  Fill in the required parameters to personalize your campaign
                  messages. All marked fields are required.
                </div>

                <div className="space-y-4">
                  {selectedTemplate?.components?.map((component, index) => {
                    const componentInputs = renderComponentInputs(
                      component,
                      index
                    );
                    if (!componentInputs) return null;

                    return (
                      <div
                        key={`component-${index}`}
                        className="border border-gray-200 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                          <Badge variant="outline" className="text-xs">
                            {component.type}
                          </Badge>
                          {component.format && (
                            <Badge variant="secondary" className="text-xs">
                              {component.format}
                            </Badge>
                          )}
                        </div>
                        {componentInputs}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Parameters Message */}
            {selectedTemplate && !templateHasParameters && (
              <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700">
                    This template doesn't require any parameters. You can create
                    the campaign directly.
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Right Section - Preview */}
        <div
          className="flex-1 flex bg-card justify-center rounded-b-2xl shadow-[0_0_10px_rgba(0,0,0,0.2)] mt-3 mb-3 mr-[5px] ml-[7px]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="bg-[#ece5dd] w-[260px] h-[500px] rounded-2xl mt-20 mb-20 shadow-lg border overflow-hidden relative flex flex-col border-4 border-gray-800">
            {/* Top bar */}
            <div className="bg-[#075e54] text-white px-4 py-2 text-sm font-medium">
              Campaign Preview
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              {selectedTemplate ? (
                <div className="bg-white rounded-lg text-sm max-w-xs shadow-md p-4 space-y-2">
                  <div className="text-xs text-gray-500 mb-2">
                    Campaign Preview
                  </div>

                  {/* Header Preview */}
                  {selectedTemplate.components?.find(
                    c => c.type === 'HEADER'
                  ) && (
                    <div className="mb-2">
                      {(() => {
                        const headerComponent =
                          selectedTemplate.components.find(
                            c => c.type === 'HEADER'
                          );
                        if (!headerComponent) return null;

                        if (
                          headerComponent.format === 'TEXT' &&
                          headerComponent.text
                        ) {
                          let previewText = headerComponent.text;
                          if (
                            headerComponent.example?.header_text &&
                            templateParams.header
                          ) {
                            headerComponent.example.header_text.forEach(
                              (_, index) => {
                                const paramValue =
                                  templateParams.header?.[index.toString()] ||
                                  `{{${index + 1}}}`;
                                previewText = previewText.replace(
                                  `{{${index + 1}}}`,
                                  paramValue
                                );
                              }
                            );
                          }
                          return (
                            <div className="font-semibold text-sm">
                              {previewText}
                            </div>
                          );
                        } else if (headerComponent.format === 'IMAGE') {
                          const uploadKey = `header-image-0`;
                          const uploadState = mediaUploads[uploadKey];
                          return (
                            <div className="bg-gray-200 rounded p-2 text-center text-xs text-gray-500 mb-2">
                              {uploadState?.uploaded && uploadState.mediaId
                                ? `📷 Image: ${uploadState.file?.name}`
                                : templateParams.header?.image_id
                                  ? `📷 Image: ${templateParams.header.image_id}`
                                  : '📷 Header Image'}
                            </div>
                          );
                        } else if (headerComponent.format === 'VIDEO') {
                          const uploadKey = `header-video-0`;
                          const uploadState = mediaUploads[uploadKey];
                          return (
                            <div className="bg-gray-200 rounded p-2 text-center text-xs text-gray-500 mb-2">
                              {uploadState?.uploaded && uploadState.mediaId
                                ? `🎥 Video: ${uploadState.file?.name}`
                                : templateParams.header?.video_id
                                  ? `🎥 Video: ${templateParams.header.video_id}`
                                  : '🎥 Header Video'}
                            </div>
                          );
                        } else if (headerComponent.format === 'DOCUMENT') {
                          const uploadKey = `header-document-0`;
                          const uploadState = mediaUploads[uploadKey];
                          return (
                            <div className="bg-gray-200 rounded p-2 text-center text-xs block text-gray-700 tracking-wide font-semibold mb-2">
                              {uploadState?.uploaded && uploadState.mediaId
                                ? `📄 Document: ${uploadState.file?.name}`
                                : templateParams.header?.document_id
                                  ? `📄 Document: ${templateParams.header.document_filename || templateParams.header.document_id}`
                                  : '📄 Header Document'}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                  {/* Body Preview */}
                  {selectedTemplate.components?.find(
                    c => c.type === 'BODY'
                  ) && (
                    <div className="mb-2">
                      {(() => {
                        const bodyComponent = selectedTemplate.components.find(
                          c => c.type === 'BODY'
                        );
                        if (!bodyComponent?.text) return null;

                        let previewText = bodyComponent.text;
                        if (
                          bodyComponent.example?.body_text?.[0] &&
                          templateParams.body
                        ) {
                          bodyComponent.example.body_text[0].forEach(
                            (_, index) => {
                              const paramValue =
                                templateParams.body?.[index.toString()] ||
                                `{{${index + 1}}}`;
                              previewText = previewText.replace(
                                `{{${index + 1}}}`,
                                paramValue
                              );
                            }
                          );
                        }
                        return (
                          <div className="text-gray-800 text-sm whitespace-pre-wrap">
                            {previewText}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Footer Preview */}
                  {selectedTemplate.components?.find(
                    c => c.type === 'FOOTER'
                  ) && (
                    <div className="mb-2">
                      {(() => {
                        const footerComponent =
                          selectedTemplate.components.find(
                            c => c.type === 'FOOTER'
                          );
                        return footerComponent?.text ? (
                          <div className="text-gray-600 text-xs">
                            {footerComponent.text}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {/* Buttons Preview */}
                  {selectedTemplate.components?.find(
                    c => c.type === 'BUTTONS'
                  ) && (
                    <div className="mt-3 pt-2 border-t border-gray-200 space-y-1">
                      {(() => {
                        const buttonComponent =
                          selectedTemplate.components.find(
                            c => c.type === 'BUTTONS'
                          );
                        if (!buttonComponent?.buttons) return null;

                        return buttonComponent.buttons.map((button, index) => {
                          if (button.type === 'URL') {
                            let urlText = button.url || '';
                            if (
                              urlText.includes('{{') &&
                              templateParams.buttons?.[index.toString()]
                            ) {
                              urlText = urlText.replace(
                                '{{1}}',
                                templateParams.buttons[index.toString()]
                              );
                            }
                            return (
                              <button
                                key={index}
                                className="w-full text-[#25D366] text-xs py-1 px-2 border border-[#25D366] rounded hover:bg-[#25D366]/10"
                              >
                                🔗 {button.text}
                              </button>
                            );
                          } else if (button.type === 'QUICK_REPLY') {
                            return (
                              <button
                                key={index}
                                className="w-full text-[#25D366] text-xs py-1 px-2 border border-[#25D366] rounded bg-[#25D366]/5"
                              >
                                {button.text}
                              </button>
                            );
                          } else if (button.type === 'PHONE_NUMBER') {
                            return (
                              <button
                                key={index}
                                className="w-full text-[#25D366] text-xs py-1 px-2 border border-[#25D366] rounded hover:bg-[#25D366]/10"
                              >
                                📞 {button.text}
                              </button>
                            );
                          }
                          return null;
                        });
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg text-sm max-w-xs shadow-md p-4 text-gray-400 text-center">
                  Select a template to see preview
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, type JSX } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type {
  CreateCampaignPayload,
  ComponentObject,
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
} from '@/store/slices/templateSlice';
import { fetchAllGroupsThunk } from '@/store/slices/groupSlice';
import { createCampaignThunk } from '@/store/slices/campiagnSlice'; // Add this import
import { AlertCircle, Badge, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Component } from '@/types/template';
import { Collapsible } from '@/components/ui/collapsible';

// Interface for template parameters collected from user
interface TemplateParams {
  header?: { [key: string]: string };
  body?: { [key: string]: string };
  buttons?: { [key: string]: string };
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

  useEffect(() => {
    dispatch(fetchAllTemplatesThunk());
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  // Handle form field changes
  const handleInputChange = (field: keyof FormData, value: string): void => {
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
    setTemplateParams(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
      return updated;
    });
  };

  // Render header inputs
  const renderHeaderInputs = (
    component: Component,
    componentIndex: number
  ): JSX.Element | null => {
    if (component.format === 'IMAGE' && component.example?.header_handle) {
      return (
        <div key={`header-${componentIndex}`} className="space-y-3">
          <div className="space-y-2">
            <Label>Header Image ID</Label>
            <Input
              type="text"
              placeholder="Enter WhatsApp media ID for image"
              onChange={e =>
                updateTemplateParam('header', 'image_id', e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Provide the WhatsApp media ID for the header image
            </p>
          </div>
        </div>
      );
    }

    if (component.format === 'TEXT' && component.example?.header_text) {
      const headerParams = component.example.header_text || [];
      return (
        <div key={`header-${componentIndex}`} className="space-y-3">
          <h5 className="text-lg font-medium">Header Parameters</h5>
          {headerParams.map((example, index) => (
            <div key={`header-param-${index}`} className="space-y-2">
              <Label>Header Parameter {index + 1}</Label>
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
      return (
        <div key={`header-${componentIndex}`} className="space-y-3">
          <div className="space-y-2">
            <Label>Header Video ID</Label>
            <Input
              type="text"
              placeholder="Enter WhatsApp media ID for video"
              onChange={e =>
                updateTemplateParam('header', 'video_id', e.target.value)
              }
            />
          </div>
        </div>
      );
    }

    if (component.format === 'DOCUMENT' && component.example?.header_handle) {
      return (
        <div key={`header-${componentIndex}`} className="space-y-3">
          <div className="space-y-2">
            <Label>Header Document ID</Label>
            <Input
              type="text"
              placeholder="Enter WhatsApp media ID for document"
              onChange={e =>
                updateTemplateParam('header', 'document_id', e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Document Filename (Optional)</Label>
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
        <h5 className="text-lg font-medium">Body Parameters</h5>
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Preview:</p>
          <p className="text-sm text-muted-foreground mt-1">{component.text}</p>
        </div>
        {exampleValues.map((example, index) => (
          <div key={`body-param-${index}`} className="space-y-2">
            <Label>Parameter {index + 1}</Label>
            <Input
              type="text"
              placeholder={`Example: ${example}`}
              onChange={e =>
                updateTemplateParam('body', index.toString(), e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
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

    return (
      <div key={`buttons-${componentIndex}`} className="space-y-3">
        <h5 className="text-lg font-medium">Button Parameters</h5>
        {component.buttons.map((button, buttonIndex) => {
          if (
            button.type === 'URL' &&
            button.url &&
            button.url.includes('{{')
          ) {
            return (
              <div key={`button-${buttonIndex}`} className="space-y-2">
                <Label>URL Parameter for "{button.text}" button</Label>
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
                <p className="text-sm text-muted-foreground">
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
          <div key={`footer-${componentIndex}`} className="space-y-3">
            <h5 className="text-lg font-medium">Footer</h5>
            <p className="text-sm text-muted-foreground">{component.text}</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Create template object according to your types
  const createTemplateObject = (): TemplateObject | null => {
    if (!selectedTemplate || !templateParams) return null;

    const components: ComponentObject[] = [];

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

            sortedEntries.forEach(([key, value]) => {
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
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Campaign</CardTitle>
          <CardDescription>
            Set up a new WhatsApp campaign with dynamic template parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Name */}
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Enter campaign name"
                required
              />
            </div>

            {/* Group Selection */}
            <div className="space-y-2">
              <Label>Select Group *</Label>
              <Select
                value={formData.groupId}
                onValueChange={value => handleInputChange('groupId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Select Template *</Label>
              <Select
                value={formData.templateId}
                onValueChange={handleTemplateSelect}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant="secondary">{template.category}</Badge>
                        <Badge
                          variant={
                            template.status === 'APPROVED'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {template.status}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        Template: {selectedTemplate.name}
                      </span>
                      <Badge variant="outline">
                        {selectedTemplate.category}
                      </Badge>
                      <Badge variant="outline">
                        {selectedTemplate.language}
                      </Badge>
                    </div>
                    <p className="text-sm">Status: {selectedTemplate.status}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Dynamic Template Inputs */}
            {selectedTemplate && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Template Parameters</h3>
                </div>
                <div className="space-y-6">
                  {selectedTemplate?.components?.map((component, index) => {
                    const componentInputs = renderComponentInputs(
                      component,
                      index
                    );
                    if (!componentInputs) return null;

                    return (
                      <Card
                        key={`component-${index}`}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardContent className="pt-6">
                          {componentInputs}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  !selectedTemplate ||
                  !formData.name ||
                  !formData.groupId ||
                  loading
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating Campaign...' : 'Create Campaign'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { Trash2, Loader2, Info, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { createTemplateThunk } from '@/store/slices/templateSlice';
import type { RootState, AppDispatch } from '@/store';
import type {
  ButtonType,
  Component,
  CreateTemplatePayload,
  HeaderFormat,
  Button as TemplateButton,
} from '@/types/template';
import { useState } from 'react';

interface CTAButton {
  label: string;
  url: string;
  type: ButtonType;
}

export default function CreateTemplatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.template);

  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState<
    'AUTHENTICATION' | 'MARKETING' | 'UTILITY' | ''
  >('');
  const [language, setLanguage] = useState('');
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

  // New state for positional arguments
  const [headerExamples, setHeaderExamples] = useState<string[]>(['']);
  const [bodyExamples, setBodyExamples] = useState<string[]>(['']);

  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.3gpp'],
    },
    maxFiles: 1,
    maxSize: 16 * 1024 * 1024, // 16MB limit for WhatsApp media
    onDrop: (acceptedFiles: File[]) => {
      setUploadedFile(acceptedFiles[0]);
      // Clear header text if media is uploaded
      if (header.trim()) {
        setHeader('');
      }
      validateField('headerMedia', '', {
        uploadedFile: acceptedFiles[0],
        header,
      });
    },
  });

  // Helper function to count positional arguments in text
  const countPositionalArgs = (text: string): number => {
    const matches = text.match(/\{\{\d+\}\}/g);
    return matches ? matches.length : 0;
  };

  // Helper function to get positional arguments from text
  const getPositionalArgs = (text: string): number[] => {
    const matches = text.match(/\{\{\d+\}\}/g) || [];
    return matches
      .map(match => parseInt(match.replace(/[{}]/g, '')))
      .sort((a, b) => a - b);
  };

  // Helper function to render text with positional arguments
  const renderTextWithArgs = (text: string, examples: string[]): string => {
    let result = text;
    const args = getPositionalArgs(text);

    args.forEach((argNum, index) => {
      const exampleValue = examples[index] || `Example ${argNum}`;
      result = result.replace(`{{${argNum}}}`, exampleValue);
    });

    return result;
  };

  // Real-time validation function for individual fields
  // Real-time validation function for individual fields
  const validateField = (
    fieldName: string,
    value: any,
    additionalContext: any = {}
  ) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case 'templateName': {
        if (!value.trim()) {
          errors.templateName = 'Template name is required';
        } else if (value.length < 1 || value.length > 512) {
          errors.templateName =
            'Template name must be between 1-512 characters';
        } else if (!/^[a-z0-9_]+$/.test(value)) {
          errors.templateName =
            'Template name must contain only lowercase letters, numbers, and underscores';
        } else {
          delete errors.templateName;
        }
        break;
      }

      case 'templateCategory': {
        if (!value) {
          errors.templateCategory = 'Category is required';
        } else {
          delete errors.templateCategory;
        }
        break;
      }

      case 'language': {
        if (!value) {
          errors.language = 'Language is required';
        } else {
          delete errors.language;
        }
        break;
      }

      case 'body': {
        if (!value.trim()) {
          errors.body = 'Body message is required';
        } else if (value.length > 1024) {
          errors.body = 'Body message cannot exceed 1024 characters';
        } else {
          delete errors.body;
        }

        // Validate body positional arguments
        const bodyArgCount = countPositionalArgs(value);
        if (bodyArgCount > 0) {
          const bodyArgs = getPositionalArgs(value);
          const expectedArgs = Array.from(
            { length: bodyArgCount },
            (_, i) => i + 1
          );

          if (!bodyArgs.every((arg, index) => arg === expectedArgs[index])) {
            errors.bodyArgs =
              'Body positional arguments must be sequential starting from {{1}}';
          } else {
            delete errors.bodyArgs;
          }

          const validBodyExamples = (
            additionalContext.bodyExamples || bodyExamples
          ).filter(ex => ex.trim());
          if (validBodyExamples.length < bodyArgCount) {
            errors.bodyExamples = `Body requires ${bodyArgCount} example value(s) for positional arguments`;
          } else {
            delete errors.bodyExamples;
          }
        } else {
          delete errors.bodyArgs;
          delete errors.bodyExamples;
        }
        break;
      }

      case 'header': {
        if (value && value.length > 60) {
          errors.header = 'Header cannot exceed 60 characters';
        } else {
          delete errors.header;
        }

        // Validate header positional arguments
        const headerArgCount = countPositionalArgs(value);
        if (headerArgCount > 0) {
          if (headerArgCount > 1) {
            errors.headerArgs = 'Header can only have one variable {{1}}';
          } else {
            const headerArgs = getPositionalArgs(value);
            if (headerArgs[0] !== 1) {
              errors.headerArgs = 'Header variable must be {{1}}';
            } else {
              delete errors.headerArgs;
            }

            const validHeaderExamples = (
              additionalContext.headerExamples || headerExamples
            ).filter(ex => ex.trim());
            if (validHeaderExamples.length < 1) {
              errors.headerExamples =
                'Header requires 1 example value for {{1}}';
            } else {
              delete errors.headerExamples;
            }
          }
        } else {
          delete errors.headerArgs;
          delete errors.headerExamples;
        }
        break;
      }

      case 'headerMedia': {
        // Header and media mutual exclusion
        const currentHeader =
          additionalContext.header !== undefined
            ? additionalContext.header
            : header;
        const currentFile =
          additionalContext.uploadedFile !== undefined
            ? additionalContext.uploadedFile
            : uploadedFile;

        if (currentHeader.trim() && currentFile) {
          errors.headerMedia =
            'Cannot use both header text and uploaded media. Choose one.';
        } else {
          delete errors.headerMedia;
        }
        break;
      }

      case 'footer': {
        if (value && value.length > 60) {
          errors.footer = 'Footer cannot exceed 60 characters';
        } else {
          delete errors.footer;
        }
        break;
      }

      case 'urlButton': {
        // Validate URL buttons
        const validURLButtons = ctaButtons.filter(
          btn => btn.label.trim() && btn.url.trim()
        );
        if (validURLButtons.length > 2) {
          errors.urlButtons = 'Maximum 2 URL buttons allowed';
        } else {
          delete errors.urlButtons;
        }

        // Validate individual URL buttons
        for (let i = 0; i < ctaButtons.length; i++) {
          const btn = ctaButtons[i];
          if (btn.label && btn.label.length > 25) {
            errors[`url_btn_${i}_label`] =
              `URL button ${i + 1} label cannot exceed 25 characters`;
          } else {
            delete errors[`url_btn_${i}_label`];
          }

          if (btn.url && btn.url.trim() && !isValidUrl(btn.url)) {
            errors[`url_btn_${i}_url`] =
              `URL button ${i + 1} has invalid URL format`;
          } else if (btn.url && btn.url.length > 2000) {
            errors[`url_btn_${i}_url`] =
              `URL button ${i + 1} URL cannot exceed 2000 characters`;
          } else {
            delete errors[`url_btn_${i}_url`];
          }
        }
        break;
      }

      case 'quickReply': {
        const validQuickReplyButtons = quickReplyButtons.filter(btn =>
          btn.trim()
        );
        const hasOtherButtons =
          ctaButtons.filter(btn => btn.label.trim() && btn.url.trim()).length >
            0 || usePhoneButton;

        if (hasOtherButtons && validQuickReplyButtons.length > 3) {
          errors.quickReplyButtons =
            'Maximum 3 quick reply buttons allowed when combined with other button types';
        } else if (!hasOtherButtons && validQuickReplyButtons.length > 10) {
          errors.quickReplyButtons =
            'Maximum 10 quick reply buttons allowed when used alone';
        } else {
          delete errors.quickReplyButtons;
        }

        for (let i = 0; i < quickReplyButtons.length; i++) {
          const btn = quickReplyButtons[i];
          if (btn && btn.length > 25) {
            errors[`quick_reply_${i}`] =
              `Quick reply button ${i + 1} cannot exceed 25 characters`;
          } else {
            delete errors[`quick_reply_${i}`];
          }
        }
        break;
      }

      case 'phoneButton': {
        if (usePhoneButton) {
          if (!phoneButton.label.trim()) {
            errors.phoneButtonLabel = 'Phone button label is required';
          } else if (phoneButton.label.length > 25) {
            errors.phoneButtonLabel =
              'Phone button label cannot exceed 25 characters';
          } else {
            delete errors.phoneButtonLabel;
          }

          if (!phoneButton.phone_number.trim()) {
            errors.phoneButtonNumber = 'Phone number is required';
          } else if (phoneButton.phone_number.length > 20) {
            errors.phoneButtonNumber =
              'Phone number cannot exceed 20 characters';
          } else {
            delete errors.phoneButtonNumber;
          }
        } else {
          delete errors.phoneButtonLabel;
          delete errors.phoneButtonNumber;
        }
        break;
      }

      default:
        break;
    }

    // Always validate total buttons when any button-related field changes
    if (['urlButton', 'quickReply', 'phoneButton'].includes(fieldName)) {
      const validURLButtons = ctaButtons.filter(
        btn => btn.label.trim() && btn.url.trim()
      );
      const validQuickReplyButtons = quickReplyButtons.filter(btn =>
        btn.trim()
      );
      const totalButtons =
        validURLButtons.length +
        validQuickReplyButtons.length +
        (usePhoneButton && phoneButton.label.trim() ? 1 : 0);

      if (totalButtons > 10) {
        errors.totalButtons =
          'Maximum 10 buttons total allowed across all types';
      } else {
        delete errors.totalButtons;
      }
    }

    setValidationErrors(errors);
  };

  const getMediaFormat = (file: File): HeaderFormat => {
    if (file.type.startsWith('image/')) return 'IMAGE';
    if (file.type.startsWith('video/')) return 'VIDEO';
    if (file.type === 'application/pdf') return 'DOCUMENT';
    return 'DOCUMENT';
  };

  const buildComponents = (): Component[] => {
    const components: Component[] = [];

    // Header component
    if (uploadedFile || header.trim()) {
      const headerComponent: Component = {
        type: 'HEADER',
      };

      if (uploadedFile) {
        headerComponent.format = getMediaFormat(uploadedFile);
        headerComponent.example = {
          header_handle: [uploadedFile.name], // This should be the actual media handle from upload API
        };
      } else if (header.trim()) {
        headerComponent.format = 'TEXT';
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

    // Add quick reply buttons (can now be mixed with other button types)
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
      name: templateName.toLowerCase().replace(/[^a-z0-9_]/g, '_'), // Ensure valid name format
      category: templateCategory as 'AUTHENTICATION' | 'MARKETING' | 'UTILITY',
      language,
      components: buildComponents(),
    };

    try {
      await dispatch(createTemplateThunk(templateData)).unwrap();
      setShowSuccessDialog(true);
      resetForm();
    } catch (err) {
      console.error('Failed to create template:', err);
      setShowErrorDialog(true);
    }
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateCategory('');
    setLanguage('');
    setHeader('');
    setBody('');
    setFooter('');
    setCtaButtons([{ label: '', url: '', type: 'URL' }]);
    setQuickReplyButtons(['']);
    setPhoneButton({ label: '', phone_number: '' });
    setUseQuickReply(false);
    setUsePhoneButton(false);
    setUploadedFile(null);
    setHeaderExamples(['']);
    setBodyExamples(['']);
    setValidationErrors({});
  };

  const hasPreviewContent =
    !!header ||
    !!body ||
    !!footer ||
    ctaButtons.some(btn => btn.label && btn.url) ||
    quickReplyButtons.some(btn => btn.trim()) ||
    (usePhoneButton && phoneButton.label) ||
    !!uploadedFile;

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex justify-end p-4 border-b">
        <Button
          className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Send to Review'
          )}
        </Button>
      </div>

      {/* Redux Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800 font-medium">Error creating template</p>
          </div>
          <p className="text-red-700 mt-1 text-sm">{error}</p>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Input Fields */}
        <div className="w-2/3 p-6 overflow-y-auto space-y-4 border-r">
          <h2 className="text-2xl font-semibold mb-4">
            {templateName || 'Template Name'}
          </h2>

          <div className="space-y-4">
            {/* Template Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Template Name *
              </label>
              <Input
                placeholder="my_template_name (lowercase, numbers, underscores only)"
                value={templateName}
                onChange={e => {
                  const value = e.target.value;
                  setTemplateName(value);
                  validateField('templateName', value);
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
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category *</label>
              <Select
                value={templateCategory}
                onValueChange={(
                  value: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY'
                ) => {
                  setTemplateCategory(value);
                  validateField('templateCategory', value);
                }}
              >
                <SelectTrigger
                  className={
                    validationErrors.templateCategory ? 'border-red-500' : ''
                  }
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="UTILITY">Utility</SelectItem>
                  <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
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
              <label className="block text-sm font-medium">Language *</label>
              <Select
                value={language}
                onValueChange={value => {
                  setLanguage(value);
                  validateField('language', value);
                }}
              >
                <SelectTrigger
                  className={validationErrors.language ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_US">English (US)</SelectItem>
                  <SelectItem value="en_GB">English (UK)</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.language && (
                <p className="text-red-500 text-sm">
                  {validationErrors.language}
                </p>
              )}
            </div>

            {/* Upload Media */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Upload Media (Optional)
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-4 rounded-md text-center cursor-pointer hover:bg-gray-50 relative ${
                  header.trim()
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    : 'border-gray-300'
                }`}
              >
                <input
                  {...getInputProps()}
                  disabled={header.trim().length > 0}
                />

                {header.trim() ? (
                  <div className="text-gray-400">
                    <p>Media upload disabled when header text is used</p>
                    <p className="text-xs mt-1">
                      Clear header text to enable media upload
                    </p>
                  </div>
                ) : isDragActive ? (
                  <p>Drop the file here ...</p>
                ) : uploadedFile ? (
                  <div className="flex items-center justify-between">
                    <p className="truncate max-w-[80%]">{uploadedFile.name}</p>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        validateField('headerMedia', '', {
                          uploadedFile: null,
                          header,
                        });
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>Drag & drop media here, or click to select</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: Images (JPEG, PNG, WebP), Videos (MP4, 3GPP),
                      Documents (PDF)
                      <br />
                      Max size: 16MB
                    </p>
                  </div>
                )}
              </div>
              {validationErrors.headerMedia && (
                <p className="text-red-500 text-sm">
                  {validationErrors.headerMedia}
                </p>
              )}
            </div>

            {/* Header Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Header Message (Optional)
              </label>
              <Input
                placeholder="Header Message (max 60 characters). Use only {{1}} for variable"
                value={header}
                onChange={e => {
                  const value = e.target.value;
                  setHeader(value);
                  validateField('header', value, { headerExamples });
                  validateField('headerMedia', '', {
                    uploadedFile,
                    header: value,
                  });

                  // Auto-adjust example fields based on positional args (max 1 for header)
                  const argCount = countPositionalArgs(value);
                  if (argCount > 0 && argCount <= 1) {
                    setHeaderExamples(['']);
                  } else if (argCount === 0) {
                    setHeaderExamples([]);
                  }
                  // Clear uploaded file if header text is added
                  if (value.trim() && uploadedFile) {
                    setUploadedFile(null);
                  }
                }}
                maxLength={60}
                disabled={!!uploadedFile}
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
              {uploadedFile && (
                <p className="text-xs text-amber-600">
                  Header text disabled when media is uploaded
                </p>
              )}
              {header.trim() && (
                <p className="text-xs text-amber-600">
                  Media upload disabled when header text is used
                </p>
              )}
              <p className="text-xs text-gray-500">
                {header.length}/60 characters
              </p>

              {/* Header Examples for Positional Arguments (only {{1}} allowed) */}
              {countPositionalArgs(header) === 1 && !uploadedFile && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-blue-600">
                    <Info className="w-4 h-4 inline mr-1" />
                    Header Example Value for {'{{1}}'}
                  </label>
                  <Input
                    placeholder="Example value for {{1}}"
                    value={headerExamples[0] || ''}
                    onChange={e => {
                      const newExamples = [e.target.value];
                      setHeaderExamples(newExamples);
                      validateField('header', header, {
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

            {/* Body Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Body Message *
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

                  validateField('body', value, {
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
                  <label className="block text-sm font-medium text-blue-600">
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
                          validateField('body', body, {
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
              <label className="block text-sm font-medium">
                Footer Message (Optional)
              </label>
              <Input
                placeholder="Footer Message (max 60 characters)"
                value={footer}
                onChange={e => {
                  const value = e.target.value;
                  setFooter(value);
                  validateField('footer', value);
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
              <label className="block text-sm font-medium">
                Buttons (Optional)
              </label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useQuickReply}
                    onChange={e => {
                      setUseQuickReply(e.target.checked);
                      validateField('quickReply', e.target.checked);
                    }}
                  />
                  Quick Reply Buttons
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={usePhoneButton}
                    onChange={e => {
                      setUsePhoneButton(e.target.checked);
                      validateField('phoneButton', e.target.checked);
                    }}
                  />
                  Phone Button
                </label>
              </div>

              <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                <Info className="w-4 h-4 inline mr-1" />
                You can now combine URL buttons with quick reply buttons and
                phone buttons. Max 2 URL buttons, max 3 quick reply when
                combined with others (10 when standalone), and 1 phone button.
              </div>

              {/* URL Buttons */}
              <div className="space-y-3">
                <h4 className="font-medium">URL Buttons (Max 2)</h4>
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
                          validateField('urlButton', updated);
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
                          validateField('urlButton', updated);
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

                    <div className="flex items-start justify-center pt-2">
                      {index === 0 ? (
                        <Button
                          variant="outline"
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
                              validateField('urlButton', updated);
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
                            validateField('urlButton', updated);
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
                  <h4 className="font-medium">
                    Quick Reply Buttons
                    {ctaButtons.filter(btn => btn.label && btn.url).length >
                      0 || usePhoneButton
                      ? '(Max 3 when combined)'
                      : '(Max 10 when standalone)'}
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
                          validateField('quickReply', updated);
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
                      <div className="flex gap-2">
                        {index === 0 ? (
                          <Button
                            variant="outline"
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
                                validateField('quickReply', updated);
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
                              validateField('quickReply', updated);
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
                  <h4 className="font-medium">Phone Button</h4>
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
                          validateField('phoneButton', true);
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
                          validateField('phoneButton', true);
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
        <div className="flex-1 border-l p-4 bg-white flex items-center justify-center">
          <div className="bg-[#ece5dd] w-[260px] h-[500px] rounded-2xl shadow-lg border overflow-hidden relative flex flex-col border-5 border-black">
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
                    {/* Media Preview */}
                    {uploadedFile && uploadedFile.type.startsWith('image/') && (
                      <img
                        src={URL.createObjectURL(uploadedFile)}
                        alt="Uploaded preview"
                        className="rounded-md mb-2 max-h-32 object-cover w-full"
                      />
                    )}

                    {uploadedFile && uploadedFile.type.startsWith('video/') && (
                      <video
                        controls
                        className="rounded-md mb-2 max-h-32 w-full object-cover"
                      >
                        <source
                          src={URL.createObjectURL(uploadedFile)}
                          type={uploadedFile.type}
                        />
                        Your browser does not support this video format.
                      </video>
                    )}

                    {uploadedFile &&
                      uploadedFile.type === 'application/pdf' && (
                        <div className="text-sm text-gray-800 font-medium mb-2 p-2 bg-gray-100 rounded">
                          📄 {uploadedFile.name}
                        </div>
                      )}

                    {/* Header Text with Variables Rendered */}
                    {header && !uploadedFile && (
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

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template Created Successfully</DialogTitle>
          </DialogHeader>
          <p>
            Your template has been submitted for WhatsApp approval. You will be
            notified once it's reviewed and approved.
          </p>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Great!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Creating Template</DialogTitle>
          </DialogHeader>
          <p>
            {error ||
              'Failed to create template. Please check your inputs and try again.'}
          </p>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

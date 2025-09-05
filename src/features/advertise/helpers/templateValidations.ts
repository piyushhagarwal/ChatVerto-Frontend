/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CTAButton, HeaderFormat } from '@/types/template';
import { countPositionalArgs, getPositionalArgs } from './templateHelpers';

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateField = (
  fieldName: string,
  value: any,
  additionalContext: {
    headerType?: HeaderFormat | '';
    headerExamples?: string[];
    bodyExamples?: string[];
    ctaButtons?: CTAButton[];
    quickReplyButtons?: string[];
    phoneButton?: { label: string; phone_number: string };
    usePhoneButton?: boolean;
    validationErrors?: Record<string, string>;
  } = {}
): Partial<Record<string, string>> => {
  const errors: Record<string, string> = {};
  const {
    headerType,
    headerExamples = [],
    bodyExamples = [],
    ctaButtons = [],
    quickReplyButtons = [],
    phoneButton = { label: '', phone_number: '' },
    usePhoneButton = false,
  } = additionalContext;

  switch (fieldName) {
    case 'templateName': {
      if (!value.trim()) {
        errors.templateName = 'Template name is required';
      } else if (value.length < 1 || value.length > 512) {
        errors.templateName = 'Template name must be between 1-512 characters';
      } else if (!/^[a-z0-9_]+$/.test(value)) {
        errors.templateName =
          'Template name must contain only lowercase letters, numbers, and underscores';
      }
      break;
    }

    case 'templateCategory': {
      if (!value) {
        errors.templateCategory = 'Category is required';
      }
      break;
    }

    case 'language': {
      if (!value) {
        errors.language = 'Language is required';
      }
      break;
    }

    case 'headerType': {
      if (!value) {
        errors.headerType = 'Header type is required if using header';
      }
      break;
    }

    case 'body': {
      if (!value.trim()) {
        errors.body = 'Body message is required';
      } else if (value.length > 1024) {
        errors.body = 'Body message cannot exceed 1024 characters';
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
        }

        const validBodyExamples = bodyExamples.filter(ex => ex.trim());
        if (validBodyExamples.length < bodyArgCount) {
          errors.bodyExamples = `Body requires ${bodyArgCount} example value(s) for positional arguments`;
        }
      }
      break;
    }

    case 'header': {
      if (value && value.length > 60) {
        errors.header = 'Header cannot exceed 60 characters';
      }

      // Validate header positional arguments only for TEXT type
      if (headerType === 'TEXT') {
        const headerArgCount = countPositionalArgs(value);
        if (headerArgCount > 0) {
          if (headerArgCount > 1) {
            errors.headerArgs = 'Header can only have one variable {{1}}';
          } else {
            const headerArgs = getPositionalArgs(value);
            if (headerArgs[0] !== 1) {
              errors.headerArgs = 'Header variable must be {{1}}';
            }

            const validHeaderExamples = headerExamples.filter(ex => ex.trim());
            if (validHeaderExamples.length < 1) {
              errors.headerExamples =
                'Header requires 1 example value for {{1}}';
            }
          }
        }
      }
      break;
    }

    case 'footer': {
      if (value && value.length > 60) {
        errors.footer = 'Footer cannot exceed 60 characters';
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
      }

      // Validate individual URL buttons
      for (let i = 0; i < ctaButtons.length; i++) {
        const btn = ctaButtons[i];
        if (btn.label && btn.label.length > 25) {
          errors[`url_btn_${i}_label`] =
            `URL button ${i + 1} label cannot exceed 25 characters`;
        }

        if (btn.url && btn.url.trim() && !isValidUrl(btn.url)) {
          errors[`url_btn_${i}_url`] =
            `URL button ${i + 1} has invalid URL format`;
        } else if (btn.url && btn.url.length > 2000) {
          errors[`url_btn_${i}_url`] =
            `URL button ${i + 1} URL cannot exceed 2000 characters`;
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
      }

      for (let i = 0; i < quickReplyButtons.length; i++) {
        const btn = quickReplyButtons[i];
        if (btn && btn.length > 25) {
          errors[`quick_reply_${i}`] =
            `Quick reply button ${i + 1} cannot exceed 25 characters`;
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
        }

        if (!phoneButton.phone_number.trim()) {
          errors.phoneButtonNumber = 'Phone number is required';
        } else if (phoneButton.phone_number.length > 20) {
          errors.phoneButtonNumber = 'Phone number cannot exceed 20 characters';
        }
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
    const validQuickReplyButtons = quickReplyButtons.filter(btn => btn.trim());
    const totalButtons =
      validURLButtons.length +
      validQuickReplyButtons.length +
      (usePhoneButton && phoneButton.label.trim() ? 1 : 0);

    if (totalButtons > 10) {
      errors.totalButtons = 'Maximum 10 buttons total allowed across all types';
    }
  }

  return errors;
};

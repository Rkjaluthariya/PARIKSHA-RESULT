import React, { useCallback, useMemo } from 'react';
import {
  sanitizeAndDecodeText,
  containsProhibitedHtml,
  stripHtmlTags,
  decodeHtmlEntities,
  truncateText
} from '../utils/ContentSanitizer';

export {
  sanitizeAndDecodeText,
  containsProhibitedHtml,
  stripHtmlTags,
  decodeHtmlEntities,
  truncateText
};

/**
 * React Custom Hook: SafeTextRenderer
 * Provides memoized functions for rendering sanitized plain text securely in frontend components.
 */
export function useSafeTextRenderer() {
  const sanitizeText = useCallback((text: string | null | undefined): string => {
    return sanitizeAndDecodeText(text);
  }, []);

  const isSafeText = useCallback((text: string | null | undefined): boolean => {
    return !containsProhibitedHtml(text);
  }, []);

  const renderSafeText = useCallback((text: string | null | undefined, fallback: string = ''): string => {
    const cleaned = sanitizeAndDecodeText(text);
    return cleaned || fallback;
  }, []);

  return useMemo(() => ({
    sanitizeText,
    isSafeText,
    renderSafeText
  }), [sanitizeText, isSafeText, renderSafeText]);
}

/**
 * Component prop definitions for SafeText wrapper component
 */
interface SafeTextProps {
  content: string | null | undefined;
  fallback?: string;
  className?: string;
  as?: React.ElementType;
  [key: string]: any;
}

/**
 * SafeText React Component - Renders sanitized text securely without HTML injection risks.
 */
export function SafeText({
  content,
  fallback = '',
  className,
  as = 'span',
  ...props
}: SafeTextProps) {
  const cleanText = sanitizeAndDecodeText(content) || fallback;
  return React.createElement(as, { className, ...props }, cleanText);
}

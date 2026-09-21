import React, { useState } from 'react';
import {
  toWebpUrl,
  getWebpSrcSet,
  getFallbackSrcSet,
  getResponsiveSizes,
  calculateAspectRatioDimensions,
  ResponsiveImageSet,
} from '../utils/webpConverter';

export interface WebpImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  targetWidth?: number;
  quality?: number;
  sizes?: string;
  responsivePreset?: 'card' | 'banner' | 'modal' | 'table' | 'thumbnail';
  widths?: number[];
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'auto';
  fallbackSrc?: string;
  className?: string;
  responsiveSet?: ResponsiveImageSet;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const WebpImage: React.FC<WebpImageProps> = ({
  src,
  alt,
  targetWidth = 800,
  quality = 75,
  sizes,
  responsivePreset,
  widths,
  aspectRatio = '16:9',
  fallbackSrc,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  responsiveSet,
  width: customWidth,
  height: customHeight,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src && !responsiveSet) {
    return null;
  }

  const effectiveSrc = responsiveSet?.src || src;
  const effectiveSizes = responsiveSet?.sizes || sizes || (responsivePreset ? getResponsiveSizes(responsivePreset) : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px');

  // Breakpoints
  const effectiveWidths = widths || (responsivePreset === 'table' || responsivePreset === 'thumbnail' ? [120, 240, 360] : [320, 480, 640, 800, 1024, 1200]);

  // Generate WebP URL and WebP Responsive SrcSet
  const webpSrc = responsiveSet?.src || toWebpUrl(effectiveSrc, { width: targetWidth, quality, format: 'webp' });
  const webpSrcSet = responsiveSet?.webpSrcSet || getWebpSrcSet(effectiveSrc, effectiveWidths, quality);
  const fallbackSrcSet = responsiveSet?.srcSet || getFallbackSrcSet(effectiveSrc, effectiveWidths, quality);

  // Dimensions to avoid CLS
  const dim = calculateAspectRatioDimensions(targetWidth, aspectRatio);
  const imgWidth = customWidth || responsiveSet?.width || dim.width;
  const imgHeight = customHeight || responsiveSet?.height || dim.height;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      e.currentTarget.src = fallbackSrc;
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <picture className="w-full h-full block">
      {/* 1. WebP Modern High-Performance Source with full responsive srcset */}
      <source
        type="image/webp"
        srcSet={webpSrcSet}
        sizes={effectiveSizes}
      />

      {/* 2. Fallback Standard Source with responsive srcset */}
      {fallbackSrcSet && (
        <source
          type="image/jpeg"
          srcSet={fallbackSrcSet}
          sizes={effectiveSizes}
        />
      )}
      
      {/* 3. Base Image with explicit width/height for zero CLS */}
      <img
        src={hasError && fallbackSrc ? fallbackSrc : webpSrc}
        alt={alt || 'Pariksha Result Official Update'}
        width={imgWidth}
        height={imgHeight}
        className={className}
        loading={loading}
        decoding={decoding}
        onError={handleImageError}
        referrerPolicy="no-referrer"
        {...props}
      />
    </picture>
  );
};


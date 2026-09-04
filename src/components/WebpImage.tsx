import React, { useState } from 'react';
import { toWebpUrl, getWebpSrcSet } from '../utils/webpConverter';

export interface WebpImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  targetWidth?: number;
  quality?: number;
  sizes?: string;
  fallbackSrc?: string;
  className?: string;
}

export const WebpImage: React.FC<WebpImageProps> = ({
  src,
  alt,
  targetWidth = 800,
  quality = 75,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
  fallbackSrc,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return null;
  }

  // Generate WebP URL and WebP Responsive SrcSet
  const webpSrc = toWebpUrl(src, { width: targetWidth, quality, format: 'webp' });
  const webpSrcSet = getWebpSrcSet(src, [400, 800, 1200], quality);

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
      {/* WebP High Performance Source */}
      <source
        type="image/webp"
        srcSet={webpSrcSet}
        sizes={sizes}
      />
      
      {/* Fallback standard Image element */}
      <img
        src={hasError && fallbackSrc ? fallbackSrc : webpSrc}
        alt={alt}
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

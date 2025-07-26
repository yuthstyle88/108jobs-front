"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  Profiler,
} from 'react';
import Image, { ImageProps } from 'next/image';
import {
  useLazyImage,
  getResponsiveImageSize,
  generateSizesAttribute,
  generatePlaceholder,
} from '@/utils/imageLoader';

import { measureRenderTime } from '@/utils/performance';
import { debounce } from '@/utils/helpers';

interface LazyImageProps extends Omit<ImageProps, 'src'> {
  imagePath: string;
  fallback?: string;
  assetType?: 'icons' | 'images'; // เพิ่ม assetType เพื่อรองรับประเภท
  breakpoints?: {
    sm?: { width: number; height: number };
    md?: { width: number; height: number };
    lg?: { width: number; height: number };
    xl?: { width: number; height: number };
  };
  responsiveSizes?: {
    default: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  preload?: boolean;
  trackPerformance?: boolean;
  blurUp?: boolean;
  placeholderColor?: string;
  errorComponent?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({
  imagePath,
  fallback,
  assetType = 'images', // กำหนด default เป็น 'images'
  breakpoints,
  responsiveSizes,
  width: defaultWidth = 0,
  height: defaultHeight = 0,
  loading = 'lazy',
  preload = false,
  trackPerformance = false,
  blurUp = false,
  placeholderColor = '#f0f0f0',
  errorComponent,
  ...props
}) => {
  const [image, ImageLoadingStatus] = useLazyImage(imagePath, {
    trackPerformance,
    preload,
    assetType, // ส่ง assetType ไปยัง useLazyImage
  });

  const [dimensions, setDimensions] = useState({
    width: typeof defaultWidth === 'number' ? defaultWidth : 0,
    height: typeof defaultHeight === 'number' ? defaultHeight : 0,
  });

  const placeholder = useMemo(() => {
    if (!blurUp) return null;
    return generatePlaceholder(
      Math.min(20, dimensions.width),
      Math.min(20, dimensions.height),
      placeholderColor
    );
  }, [blurUp, dimensions, placeholderColor]);

  const handleResize = useCallback(
    debounce(() => {
      if (!breakpoints) return;
      const newDims = getResponsiveImageSize(
        {
          width: typeof defaultWidth === 'number' ? defaultWidth : 0,
          height: typeof defaultHeight === 'number' ? defaultHeight : 0,
        },
        breakpoints
      );
      setDimensions(newDims);
    }, 100),
    [breakpoints, defaultWidth, defaultHeight]
  );

  useEffect(() => {
    if (!breakpoints) return;
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints, handleResize]);

  useEffect(() => {
    if (!preload || typeof window === 'undefined') return;
    try {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imagePath.startsWith('http')
        ? imagePath
        : new URL(imagePath, window.location.origin).toString();
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    } catch (e) {
      console.warn('Preload failed:', e);
    }
  }, [imagePath, preload]);

  const sizes = responsiveSizes ? generateSizesAttribute(responsiveSizes) : undefined;
  const { alt = '', className = '', style = {}, ...otherProps } = props;

  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isBlur, setIsBlur] = useState(false);

  useEffect(() => {
    if (ImageLoadingStatus.isLoading) {
      if (fallback) {
        setImgSrc(fallback);
        setIsBlur(false);
      } else if (blurUp && placeholder) {
        setImgSrc(placeholder);
        setIsBlur(true);
      } else {
        setImgSrc(null);
        setIsBlur(false);
      }
    } else if (ImageLoadingStatus.isLoaded && image) {
      const src = typeof image === "string" ? image : image.src; // แปลง StaticImageData
      setImgSrc(src);
    }
  }, [ImageLoadingStatus, fallback, blurUp, placeholder, image]);

  if (ImageLoadingStatus.isError) {
    return errorComponent ? (
      <>{errorComponent}</>
    ) : (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
        style={{
          width: dimensions.width || '100%',
          height: dimensions.height || '100%',
          ...style,
        }}
      >
        <span className="text-xs text-gray-500">Failed to load image</span>
      </div>
    );
  }

  if (!imgSrc) {
    return (
      <div
        className={`${className} bg-gray-100`}
        style={{
          width: dimensions.width || '100%',
          height: dimensions.height || '100%',
          ...style,
        }}
      />
    );
  }

  const img = (
    <Image
      src={imgSrc}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      sizes={sizes}
      loading={loading}
      className={`${className} ${isBlur ? 'blur-sm' : ''}`.trim()}
      style={{ backgroundColor: placeholderColor, ...style }}
      {...otherProps}
    />
  );

  return trackPerformance ? (
    <Profiler id={`LazyImage-${imagePath}`} onRender={measureRenderTime}>
      {img}
    </Profiler>
  ) : (
    img
  );
};

export default memo(LazyImage);
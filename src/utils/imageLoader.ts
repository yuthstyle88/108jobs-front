import { StaticImageData } from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { measureAsyncExecutionTime, trackMetric } from './performance';

/**
 * Interface for image loading status
 */
export interface ImageLoadingStatus {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isLoaded: boolean;
}

/**
 * A utility hook for lazy loading images with performance tracking
 * @param imagePath The path to the image to load
 * @param options Additional options for image loading
 * @returns The loaded image, loading status, and error information
 */
export function useLazyImage(
  imagePath: string,
  options: {
    assetType?: 'icons' | 'images'; // เพิ่ม assetType เพื่อรองรับประเภทไฟล์
    trackPerformance?: boolean;
    preload?: boolean;
  } = {}
): [StaticImageData | undefined, ImageLoadingStatus] {
  const [image, setImage] = useState<StaticImageData>();
  const [status, setStatus] = useState<ImageLoadingStatus>({
    isLoading: true,
    isError: false,
    isLoaded: false,
  });

  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);

  // Determine the base path based on assetType
  const basePath = options.assetType === 'icons' ? '../assets/icons' : '../assets/images';

  // Load image function wrapped with performance tracking
  const loadImage = useCallback(async () => {
    if (!isMountedRef.current) return;

    setStatus({ isLoading: true, isError: false, isLoaded: false });

    try {
      // Use performance tracking if enabled
      const loadFn = async () => {
        try {
          const importedImage = await import(`${basePath}/${imagePath}`);
          if (isMountedRef.current) {
            setImage(importedImage.default);
            setStatus({ isLoading: false, isError: false, isLoaded: true });
          }
          return importedImage.default;
        } catch (error) {
          if (isMountedRef.current) {
            const errorMessage = `Error loading image: ${basePath}/${imagePath}`;
            console.error(errorMessage, error);
            setStatus({
              isLoading: false,
              isError: true,
              errorMessage: errorMessage,
              isLoaded: false,
            });
          }
          throw error;
        }
      };

      if (options.trackPerformance) {
        await measureAsyncExecutionTime(loadFn, `Load image: ${basePath}/${imagePath}`);
        // Track image load in metrics
        trackMetric(`image_load_${imagePath.replace(/\//g, '_')}`, performance.now());
      } else {
        await loadFn();
      }
    } catch (error) {
      // Error is already handled in the loadFn
    }
  }, [imagePath, basePath, options.trackPerformance]);

  // Effect to load the image
  useEffect(() => {
    isMountedRef.current = true;

    // If preload is enabled, load immediately
    if (options.preload) {
      loadImage();
    } else {
      // Use requestIdleCallback for non-critical images if available
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        const idleCallback = (window as any).requestIdleCallback(() => {
          loadImage();
        });

        return () => {
          if ('cancelIdleCallback' in window) {
            (window as any).cancelIdleCallback(idleCallback);
          }
        };
      } else {
        // Fallback to setTimeout for browsers that don't support requestIdleCallback
        const timeoutId = setTimeout(loadImage, 0);

        return () => {
          clearTimeout(timeoutId);
        };
      }
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [loadImage, options.preload]);

  return [image, status];
}


export function generatePlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#f0f0f0'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${color}" />
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function getResponsiveImageSize(
  defaultSize: { width: number; height: number },
  breakpoints?: {
    sm?: { width: number; height: number };
    md?: { width: number; height: number };
    lg?: { width: number; height: number };
    xl?: { width: number; height: number };
  }
): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return defaultSize;
  }

  const width = window.innerWidth;

  if (width < 640 && breakpoints?.sm) {
    return breakpoints.sm;
  } else if (width < 768 && breakpoints?.md) {
    return breakpoints.md;
  } else if (width < 1024 && breakpoints?.lg) {
    return breakpoints.lg;
  } else if (width < 1280 && breakpoints?.xl) {
    return breakpoints.xl;
  }

  return defaultSize;
}

export function generateSizesAttribute(sizes: {
  default: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}): string {
  const sizeEntries = [];

  if (sizes.xl) {
    sizeEntries.push(`(min-width: 1280px) ${sizes.xl}`);
  }
  if (sizes.lg) {
    sizeEntries.push(`(min-width: 1024px) ${sizes.lg}`);
  }
  if (sizes.md) {
    sizeEntries.push(`(min-width: 768px) ${sizes.md}`);
  }
  if (sizes.sm) {
    sizeEntries.push(`(min-width: 640px) ${sizes.sm}`);
  }

  sizeEntries.push(sizes.default);

  return sizeEntries.join(', ');
}
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
    trackPerformance?: boolean;
    preload?: boolean;
  } = {}
): [StaticImageData | undefined, ImageLoadingStatus] {
  const [image, setImage] = useState<StaticImageData>();
  const [status, setStatus] = useState<ImageLoadingStatus>({
    isLoading: true,
    isError: false
  });
  
  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);

  // Load image function wrapped with performance tracking
  const loadImage = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setStatus({ isLoading: true, isError: false });
    
    try {
      // Use performance tracking if enabled
      const loadFn = async () => {
        try {
          const importedImage = await import(`../assets/images/${imagePath}`);
          if (isMountedRef.current) {
            setImage(importedImage.default);
            setStatus({ isLoading: false, isError: false });
          }
          return importedImage.default;
        } catch (error) {
          if (isMountedRef.current) {
            const errorMessage = `Error loading image: ${imagePath}`;
            console.error(errorMessage, error);
            setStatus({ 
              isLoading: false, 
              isError: true, 
              errorMessage: errorMessage 
            });
          }
          throw error;
        }
      };
      
      if (options.trackPerformance) {
        await measureAsyncExecutionTime(loadFn, `Load image: ${imagePath}`);
        // Track image load in metrics
        trackMetric(`image_load_${imagePath.replace(/\//g, '_')}`, performance.now());
      } else {
        await loadFn();
      }
    } catch (error) {
      // Error is already handled in the loadFn
    }
  }, [imagePath, options.trackPerformance]);

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

/**
 * Preloads an image for later use
 * @param imagePath The path to the image to preload
 * @returns A promise that resolves when the image is loaded
 */
export async function preloadImage(imagePath: string): Promise<StaticImageData> {
  return measureAsyncExecutionTime(async () => {
    try {
      const importedImage = await import(`../assets/images/${imagePath}`);
      return importedImage.default;
    } catch (error) {
      console.error(`Error preloading image: ${imagePath}`, error);
      throw error;
    }
  }, `Preload image: ${imagePath}`);
}

/**
 * A utility function to get the appropriate image size based on the viewport
 * @param defaultSize The default size of the image
 * @param breakpoints The breakpoints for different viewport sizes
 * @returns The appropriate image size
 */
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

/**
 * A utility function to generate the sizes attribute for responsive images
 * @param sizes An object containing the sizes for different viewport widths
 * @returns A string to use as the sizes attribute
 */
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

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generates a low-quality image placeholder (LQIP) data URL
 * @param width The width of the placeholder
 * @param height The height of the placeholder
 * @param color The background color of the placeholder
 * @returns A data URL for the placeholder
 */
export function generatePlaceholder(
  width: number = 10,
  height: number = 10,
  color: string = '#f0f0f0'
): string {
  if (typeof document === 'undefined') {
    // Return a simple data URL when running on the server
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${color.replace('#', '%23')}'/%3E%3C/svg%3E`;
  }
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  // Get the canvas context
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }
  
  // Fill the canvas with the specified color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  // Convert the canvas to a data URL
  return canvas.toDataURL('image/jpeg', 0.1);
}
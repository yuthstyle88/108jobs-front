import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import Image, { ImageProps } from 'next/image';
import { 
  useLazyImage, 
  getResponsiveImageSize, 
  generateSizesAttribute, 
  debounce,
  generatePlaceholder,
  preloadImage,
  ImageLoadingStatus
} from '@/utils/imageLoader';
import { measureRenderTime } from '@/utils/performance';
import { Profiler } from 'react';

interface LazyImageProps extends Omit<ImageProps, 'src'> {
  /**
   * The path to the image relative to the assets/images directory
   * e.g. "landing/topWorks.webp" for "../assets/images/landing/topWorks.webp"
   */
  imagePath: string;
  
  /**
   * Fallback image to show while the main image is loading
   */
  fallback?: string;
  
  /**
   * Responsive breakpoints for image dimensions
   */
  breakpoints?: {
    sm?: { width: number; height: number };
    md?: { width: number; height: number };
    lg?: { width: number; height: number };
    xl?: { width: number; height: number };
  };
  
  /**
   * Responsive sizes attribute for different viewport widths
   */
  responsiveSizes?: {
    default: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  
  /**
   * Whether to preload the image (for critical images)
   */
  preload?: boolean;
  
  /**
   * Whether to track performance metrics for this image
   */
  trackPerformance?: boolean;
  
  /**
   * Whether to use blur-up loading effect
   */
  blurUp?: boolean;
  
  /**
   * Custom placeholder color for blur-up effect
   */
  placeholderColor?: string;
  
  /**
   * Custom error component or element to show when image fails to load
   */
  errorComponent?: React.ReactNode;
}

/**
 * LazyImage component that dynamically imports images and provides responsive sizing
 * with performance tracking, blur-up loading, and error handling
 */
const LazyImage: React.FC<LazyImageProps> = ({
  imagePath,
  fallback,
  breakpoints,
  responsiveSizes,
  width: defaultWidth,
  height: defaultHeight,
  loading = 'lazy',
  preload = false,
  trackPerformance = false,
  blurUp = false,
  placeholderColor = '#f0f0f0',
  errorComponent,
  ...props
}) => {
  // Dynamically import the image with performance tracking
  const [image, loadingStatus] = useLazyImage(imagePath, {
    trackPerformance,
    preload
  });
  
  // State for responsive dimensions
  const [dimensions, setDimensions] = useState({
    width: typeof defaultWidth === 'number' ? defaultWidth : 0,
    height: typeof defaultHeight === 'number' ? defaultHeight : 0,
  });
  
  // State for placeholder
  const [placeholder, setPlaceholder] = useState<string | null>(
    blurUp ? generatePlaceholder(
      Math.min(20, typeof defaultWidth === 'number' ? defaultWidth : 20),
      Math.min(20, typeof defaultHeight === 'number' ? defaultHeight : 20),
      placeholderColor
    ) : null
  );
  
  // Create a debounced resize handler
  const handleResize = useCallback(
    debounce(() => {
      if (!breakpoints) return;
      
      const newDimensions = getResponsiveImageSize(
        {
          width: typeof defaultWidth === 'number' ? defaultWidth : 0,
          height: typeof defaultHeight === 'number' ? defaultHeight : 0,
        },
        breakpoints
      );
      setDimensions(newDimensions);
    }, 100),
    [breakpoints, defaultWidth, defaultHeight]
  );
  
  // Update dimensions on window resize if breakpoints are provided
  useEffect(() => {
    if (!breakpoints) return;
    
    // Set initial dimensions
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints, handleResize]);
  
  // Generate sizes attribute if provided
  const sizes = responsiveSizes ? generateSizesAttribute(responsiveSizes) : undefined;
  
  // Extract alt from props to avoid duplication
  const { alt = '', className = '', style = {}, ...otherProps } = props;
  
  // Preload critical images
  useEffect(() => {
    if (preload && typeof window !== 'undefined') {
      // Use link preload for truly critical images
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imagePath;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [imagePath, preload]);
  
  // Handle loading state
  if (loadingStatus.isLoading) {
    // Show fallback while image is loading
    if (fallback) {
      return (
        <div className={className} style={{ position: 'relative', ...style }}>
          <Image
            src={fallback}
            alt={alt || 'Loading...'}
            width={dimensions.width || undefined}
            height={dimensions.height || undefined}
            sizes={sizes}
            loading={loading}
            className={className}
            {...otherProps}
          />
        </div>
      );
    }
    
    // Show placeholder if blur-up is enabled
    if (blurUp && placeholder) {
      return (
        <div 
          className={className} 
          style={{ 
            position: 'relative',
            backgroundColor: placeholderColor,
            ...style 
          }}
        >
          <Image
            src={placeholder}
            alt={alt || 'Loading...'}
            width={dimensions.width || undefined}
            height={dimensions.height || undefined}
            sizes={sizes}
            className={`${className} blur-sm`}
            {...otherProps}
          />
        </div>
      );
    }
    
    // Default loading state
    return (
      <div 
        className={className} 
        style={{ 
          backgroundColor: placeholderColor,
          width: dimensions.width || '100%',
          height: dimensions.height || '100%',
          ...style 
        }} 
      />
    );
  }
  
  // Handle error state
  if (loadingStatus.isError) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }
    
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-100`} 
        style={{ 
          width: dimensions.width || '100%',
          height: dimensions.height || '100%',
          ...style 
        }}
      >
        <span className="text-xs text-gray-500">Failed to load image</span>
      </div>
    );
  }
  
  // Render the image once loaded
  const imageComponent = (
    <Image
      src={image!}
      alt={alt}
      width={dimensions.width || undefined}
      height={dimensions.height || undefined}
      sizes={sizes}
      loading={loading}
      className={className}
      style={style}
      {...otherProps}
    />
  );
  
  // Wrap with Profiler if performance tracking is enabled
  if (trackPerformance) {
    return (
      <Profiler id={`LazyImage-${imagePath}`} onRender={measureRenderTime}>
        {imageComponent}
      </Profiler>
    );
  }
  
  return imageComponent;
};

// Memoize the component to prevent unnecessary re-renders
export default memo(LazyImage);
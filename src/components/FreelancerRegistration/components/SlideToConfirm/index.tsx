import LoadingCircle from "@/components/LoadingCircle";
import { cn } from "@/lib/utils";
import { ApplyToBeFreelancerLanguage } from "@/types/language";
import { ArrowRight, Check } from "lucide-react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

interface SwipeToConfirmProps {
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  swipeThreshold?: number;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  successText?: string;
  language: Partial<ApplyToBeFreelancerLanguage> | undefined | null;
}

// Memoized thumb component to prevent unnecessary re-renders
const ThumbComponent = memo(
  ({
    isDragging,
    position,
    onMouseDown,
    onTouchStart,
  }: {
    isDragging: boolean;
    position: number;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  }) => (
    <div
      className={cn(
        "absolute left-[2px] top-[2px] flex h-[calc(100%-4px)] w-12 cursor-grab items-center justify-center rounded bg-white shadow-md will-change-transform p-1",
        {
          "cursor-grabbing": isDragging,
          "scale-90": isDragging,
        }
      )}
      style={{
        transform: `translateX(${position}px)`,
        transition: !isDragging
          ? `transform ${position === 0 ? "0.3s ease-out" : "0.2s ease"}`
          : "none", // Remove transition during dragging for smoother experience
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <ArrowRight
        className={cn("h-5 w-5 text-blue-600 will-change-transform", {
          "translate-x-1": isDragging,
        })}
        style={{
          transition: isDragging
            ? "transform 0.05s ease"
            : "transform 0.2s ease",
        }}
      />
    </div>
  )
);

ThumbComponent.displayName = "ThumbComponent";

// Memoized loading state component
const LoadingComponent = memo(
  ({
    text,
    language,
  }: {
    text?: string;
    language: Partial<ApplyToBeFreelancerLanguage> | undefined | null;
  }) => {
    const displayText = text ?? language?.processing ?? "Processing...";

    return (
      <div className="flex h-12 items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <span>{displayText}</span>
          <LoadingCircle />
        </div>
      </div>
    );
  }
);

LoadingComponent.displayName = "LoadingComponent";

// Memoized success state component
const SuccessComponent = memo(({ text }: { text: string }) => (
  <div className="flex h-12 items-center justify-center">
    <div className="flex items-center justify-center space-x-2">
      <span>{text}</span>
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <Check className="h-4 w-4 text-emerald-500" />
      </div>
    </div>
  </div>
));

SuccessComponent.displayName = "SuccessComponent";

const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({
  onConfirm,
  language,
  confirmText = language?.accept_by_sliding || "Accept by sliding",
  swipeThreshold = 0.8, // 80% threshold
  className,
  disabled = false,
  isLoading = false,
  isSuccess = false,
  successText = language?.i_accept || "I accept",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const wasAboveThresholdRef = useRef(false);
  const thresholdMetRef = useRef(false);
  // Use refs instead of state for values that don't need to trigger re-renders
  const positionRef = useRef(0);
  const dragStateRef = useRef(false);
  const maxTravelRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const transitionActiveRef = useRef(false);

  // Calculate max travel distance once when component loads or when track size changes
  useEffect(() => {
    const updateMaxTravel = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.offsetWidth;
        const thumbWidth = 48; // Width of thumb (w-12)
        maxTravelRef.current = trackWidth - thumbWidth - 4; // Subtract padding (2px on each side)

        // Mark as initialized after first calculation
        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    };

    updateMaxTravel();

    // Recalculate on resize
    window.addEventListener("resize", updateMaxTravel);
    return () => window.removeEventListener("resize", updateMaxTravel);
  }, [isInitialized]);

  const resetSwiper = useCallback(() => {
    transitionActiveRef.current = true;
    setTimeout(() => {
      setPosition(0);
      positionRef.current = 0;
      setCompleted(false);
      wasAboveThresholdRef.current = false;
      thresholdMetRef.current = false;

      // Add a small delay to allow animation to complete before enabling drag again
      setTimeout(() => {
        transitionActiveRef.current = false;
      }, 350);
    }, 100);
  }, []);

  const handleConfirmAction = useCallback(() => {
    setCompleted(true);
    transitionActiveRef.current = true;

    // Call the onConfirm callback provided by the parent
    if (onConfirm) {
      onConfirm();
    }
  }, [onConfirm]);

  const calculatePercentage = useCallback((currentPosition: number): number => {
    if (maxTravelRef.current <= 0) return 0;
    return Math.min(Math.max(currentPosition / maxTravelRef.current, 0), 1);
  }, []);

  const handleDragStart = useCallback(
    (clientX: number) => {
      if (
        disabled ||
        completed ||
        isLoading ||
        !isInitialized ||
        transitionActiveRef.current
      )
        return;

      // Cancel any pending animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Immediately set position to avoid jumps
      dragStateRef.current = true;
      setIsDragging(true);
      thresholdMetRef.current = false;

      // Store start position accounting for current thumb position
      startXRef.current = clientX - positionRef.current;
    },
    [disabled, completed, isLoading, isInitialized]
  );

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (
        !dragStateRef.current ||
        disabled ||
        completed ||
        isLoading ||
        !isInitialized ||
        transitionActiveRef.current
      )
        return;

      // Calculate new position
      let newPosition = clientX - startXRef.current;

      // Constrain position to valid range (0 to maxTravel)
      newPosition = Math.max(0, Math.min(newPosition, maxTravelRef.current));

      // Store in ref without causing re-render
      positionRef.current = newPosition;

      // Use requestAnimationFrame to optimize updates and prevent stuttering
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          setPosition(positionRef.current);

          // Track if we've met the threshold
          const percentage = calculatePercentage(positionRef.current);
          thresholdMetRef.current = percentage >= swipeThreshold;

          animationFrameRef.current = null;
        });
      }
    },
    [
      disabled,
      completed,
      isLoading,
      calculatePercentage,
      swipeThreshold,
      isInitialized,
    ]
  );

  const handleDragEnd = useCallback(() => {
    if (
      !dragStateRef.current ||
      disabled ||
      completed ||
      isLoading ||
      !isInitialized ||
      transitionActiveRef.current
    )
      return;

    // Cancel any pending animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsDragging(false);
    dragStateRef.current = false;

    // Only confirm if threshold was met
    if (thresholdMetRef.current) {
      handleConfirmAction();
    } else {
      // If below threshold, reset position with animation
      transitionActiveRef.current = true;
      setPosition(0);
      positionRef.current = 0;

      // Add a small delay to allow animation to complete before enabling drag again
      setTimeout(() => {
        transitionActiveRef.current = false;
      }, 350);
    }
  }, [disabled, completed, isLoading, handleConfirmAction, isInitialized]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  // Add global event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragStateRef.current) {
        handleDragMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (dragStateRef.current) {
        handleDragEnd();
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (dragStateRef.current && e.touches[0]) {
        e.preventDefault(); // Prevent scrolling while dragging
        handleDragMove(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (dragStateRef.current) {
        handleDragEnd();
      }
    };

    // Add listeners with passive option for better touch performance, except for touchmove
    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    window.addEventListener("touchend", handleGlobalTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);

      // Clean up any pending animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleDragMove, handleDragEnd]);

  // If success or loading state changes, reset the swiper after a delay
  useEffect(() => {
    if (isSuccess || !isLoading) {
      resetSwiper();
    }
  }, [isSuccess, isLoading, resetSwiper]);

  // Memoize the render content to prevent unnecessary re-renders
  const renderContent = useCallback(() => {
    if (isLoading) {
      return <LoadingComponent language={language} />;
    }

    if (isSuccess) {
      return <SuccessComponent text={successText} />;
    }

    return (
      <>
        <div className="flex h-12 items-center justify-center">
          <div
            className={cn("transition-opacity duration-200", {
              "opacity-0": position > 20,
            })}
          >
            {confirmText}
          </div>
        </div>
        <ThumbComponent
          isDragging={isDragging}
          position={position}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </>
    );
  }, [
    isLoading,
    isSuccess,
    successText,
    position,
    isDragging,
    confirmText,
    handleMouseDown,
    handleTouchStart,
  ]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-blue-600 text-white transition-all px-1 py-1",
        className,
        {
          "opacity-70": disabled,
          "cursor-not-allowed": disabled,
          "bg-emerald-500": isSuccess, // Use emerald-500 for the success state
        }
      )}
      ref={trackRef}
    >
      {renderContent()}
    </div>
  );
};

export default memo(SwipeToConfirm);

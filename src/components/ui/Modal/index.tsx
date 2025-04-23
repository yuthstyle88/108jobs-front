
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  contentClassName,
  showCloseButton = true,
  closeOnOutsideClick = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!isVisible) return;

    setIsLeaving(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsLeaving(false);
      onClose();
    }, 200); // Match animation duration

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      handleClose();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  // Handle close with animation


  // Handle click outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/40",
        isLeaving ? "animate-backdrop-hide" : "animate-backdrop-show"
      )}
      onClick={handleOutsideClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden",
          isLeaving ? "animate-modal-hide" : "animate-modal-show",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className={`flex items-center justify-between p-4 ${title && "border-b"}`}>
            {title && <h2 className="text-lg font-medium flex justify-center items-center w-full text-text_primary">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
        <div className={cn("p-4", contentClassName)}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

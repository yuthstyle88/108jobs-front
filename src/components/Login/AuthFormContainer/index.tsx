"use client";
import { ArrowLeftIcon } from "lucide-react";

export const AuthFormContainer = ({
  children,
  title,
  onBack,
}: {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
}) => (
  <div className="bg-white rounded-3xl shadow-xl w-[28rem] max-w-2xl mx-auto p-10 gap-y-6">
    <div className="flex items-center gap-4 mb-6">
      {onBack && (
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2 -ml-2"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
      )}
    </div>
    <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
      {title}
    </h3>
    {children}
  </div>
);
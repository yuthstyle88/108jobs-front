// components/ui/CustomInput.tsx
"use client";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UseFormSignUpReturn } from "react-hook-form";

type InputProps = {
  type?: string;
  label?: string;
  name: string;
  register?: UseFormSignUpReturn;
  error?: string;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
  placeholder?: string;
  readonly?: boolean,
};

export const CustomInput = ({
  type = "text",
  label,
  name,
  register,
  error,
  showPassword,
  toggleShowPassword,
  placeholder,
  readonly = false,
}: InputProps) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? "text" : type}
        {...register}
        className={`text-text_primary w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
          error ? "border-red-500 focus:ring-red-500 focus:shadow-inputShadow" : "border-gray-300 focus:ring-blue-500"
        }`}
        placeholder={placeholder}
        name={name}
        readOnly={readonly}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            className="text-text_secondary"
          />
        </button>
      )}
    </div>
    {error && (
      <p className="text-red-500 font-sans text-[13px] mt-1">{error}</p>
    )}
  </div>
);
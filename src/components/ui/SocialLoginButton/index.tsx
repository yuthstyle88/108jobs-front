"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-brands-svg-icons";

export const SocialLoginButton = ({
  icon,
  provider,
  onClick,
}: {
  icon: IconDefinition;
  provider: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 flex justify-center items-center transition duration-300"
  >
    <FontAwesomeIcon icon={icon} className="mr-3 text-lg" />
    เข้าสู่ระบบด้วย {provider}
  </button>
);
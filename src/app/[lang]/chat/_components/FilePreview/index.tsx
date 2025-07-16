"use client";

import { usePrivateBlob } from "@/hooks/api-hooks/usePrivateBlob";
import { FileText, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FilePreviewProps {
  fileUrl: string;
  fileType: string;
  fileName?: string;
  showDownloadLink?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  fileUrl,
  fileType,
  fileName,
  showDownloadLink = true,
}) => {
  const { blobUrl, isLoading, error } = usePrivateBlob(fileUrl);

  const isImage = fileType.startsWith("image");
  const isAudio = fileType.startsWith("audio");

  return (
    <div className="flex items-center bg-white border border-[#cfd4d8] p-4 rounded-[4px] cursor-pointer">
      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 border rounded overflow-hidden">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        ) : error ? (
          <FileText className="text-red-500 w-5 h-6" />
        ) : isImage && blobUrl ? (
          <Image
            src={blobUrl}
            width={40}
            height={40}
            alt="preview"
            className="object-cover w-10 h-10"
          />
        ) : isAudio ? (
          <Music2 className="text-gray-500 w-5 h-6" />
        ) : (
          <FileText className="text-gray-500 w-5 h-6" />
        )}
      </div>

      <div className="flex-1 flex flex-col ml-4 text-textPrimary overflow-hidden">
        <strong className="line-clamp-1 break-all text-sm">
          {fileName || "Attach File"}
        </strong>

        {showDownloadLink && blobUrl && (
          <Link prefetch={false}
            href={blobUrl}
            rel="noopener noreferrer"
            className="text-blue-600 underline"
            download={fileName}
          >
            <small>Download</small>
          </Link>
        )}

        {!blobUrl && !isLoading && (
          <small className="text-red-500">Cannot download</small>
        )}
      </div>
    </div>
  );
};

export default FilePreview;

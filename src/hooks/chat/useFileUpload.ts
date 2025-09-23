import { useCallback, useState } from 'react';
import { HttpService } from '@/services/HttpService';
import { REQUEST_STATE } from '@/services/HttpService';

export type UploadedFile = { fileUrl: string; fileType: string; fileName: string } | null;

export const useFileUpload = (opts: { setError: (msg: string | null) => void; t: (k: string) => string | undefined }) => {
  const { setError, t } = opts;
  const [selectedFile, setSelectedFile] = useState<UploadedFile>(null);
  const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);

  const handleFileUpload = useCallback(async (e: Event) => {
    try {
      const input = e.target as HTMLInputElement | null;
      const file = (input?.files && input.files[0]) || (e as any).dataTransfer?.files?.[0];
      if (!file) return;

      const maxSizeMb = 25;
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File too large. Max ${maxSizeMb}MB`);
        return;
      }
      const fileType = file.type || 'application/octet-stream';

      setError(null);
      const res = await HttpService.client.uploadFile({ image: file } as any);
      if (res.state !== REQUEST_STATE.SUCCESS) {
        const msg = (res as any)?.err?.message || 'Failed to upload file.';
        setError(msg);
        return;
      }
      const data: any = (res as any).data;
      const uploaded = {
        fileUrl: String(data?.url || ''),
        fileType,
        fileName: String(data?.filename || file.name || 'file'),
      };
      if (!uploaded.fileUrl) {
        setError('Upload succeeded but no file URL returned.');
        return;
      }
      setSelectedFile(uploaded);

      if (input) input.value = '';
    } catch (err) {
      setError('Failed to upload file. Please try again.');
    }
  }, [setError]);

  const handleRemoveSelectedFile = useCallback(async () => {
    if (!selectedFile || isDeletingFile) return;
    try {
      setIsDeletingFile(true);
      setError(null);
      const res = await HttpService.client.deleteFile(selectedFile.fileName as any);
      if (res.state !== REQUEST_STATE.SUCCESS) {
        const msg = (res as any)?.err?.message || opts.t('profileChat.deleteFileError') || 'Failed to delete file.';
        setError(msg);
        return;
      }
      setSelectedFile(null);
    } catch (err) {
      setError(opts.t('profileChat.deleteFileError') || 'Failed to delete file.');
    } finally {
      setIsDeletingFile(false);
    }
  }, [isDeletingFile, selectedFile, setError, t]);

  return {
    selectedFile,
    setSelectedFile,
    isDeletingFile,
    handleFileUpload,
    handleRemoveSelectedFile,
  } as const;
};

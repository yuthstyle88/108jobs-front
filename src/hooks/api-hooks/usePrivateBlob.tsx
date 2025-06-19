import { useEffect, useState } from "react";
import { axiosPrivate } from "@/lib/axios";

export const usePrivateBlob = (url: string | null) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    axiosPrivate
      .get(url, { responseType: "blob" })
      .then((res) => {
        const blob = new Blob([res.data], { type: res.headers["content-type"] });
        const objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch((err) => {
        setError("Không thể tải file");
        console.error("Blob fetch error", err);
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { blobUrl, isLoading, error };
};

"use client";
import React, {createContext, useCallback, useContext, useMemo, useRef, useState} from "react";

export type AnnouncementType = "success" | "error" | "info";
export type Announcement = {
  id: string;
  message: string;
  type: AnnouncementType;
  createdAt: number;
};

type AnnouncementContextType = {
  announcements: Announcement[];
  announce: (message: string, type?: AnnouncementType) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
};

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider = ({children}: {children: React.ReactNode}) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const counterRef = useRef(0);

  const announce = useCallback((message: string, type: AnnouncementType = "info") => {
    const id = `${Date.now()}-${counterRef.current++}`;
    setAnnouncements(prev => {
      const next: Announcement[] = [...prev, { id, message, type, createdAt: Date.now() }];
      // keep a small history to avoid unbounded growth
      return next.slice(-5);
    });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setAnnouncements([]), []);

  const value = useMemo(() => ({announcements, announce, dismiss, clearAll}), [announcements, announce, dismiss, clearAll]);

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const ctx = useContext(AnnouncementContext);
  if (!ctx) throw new Error("useAnnouncements must be used within an AnnouncementProvider");
  return ctx;
};

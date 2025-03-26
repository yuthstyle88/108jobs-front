"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

interface SessionContextType {
  session: Session | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionUserProvider = ({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) => {
  const { data: session } = useSession();

  return (
    <SessionContext.Provider value={{ session: session || initialSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionContext must be used within a SessionUserProvider");
  }
  return context;
};

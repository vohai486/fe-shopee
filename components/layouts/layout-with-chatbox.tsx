import React, { ReactNode } from "react";
import { ChatFrame } from "../common";
import { useAuth } from "@/hooks";

export interface IAppProps {}

export function LayoutWithChatBox({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  return (
    <>
      {children}
      {profile?._id && <ChatFrame />}
    </>
  );
}

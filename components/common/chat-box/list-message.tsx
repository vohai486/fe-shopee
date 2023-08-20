import { AppContext } from "@/contexts/app.context";
import { useAuth } from "@/hooks";
import { Message } from "@/types";
import { formatDate } from "@/utils";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";

export interface ListMessageProps {
  listMessage: Message[];
  scrollToBottom: () => void;
  isSeen: boolean;
  lastView: Date;
}

export function ListMessage({
  listMessage,
  scrollToBottom,
  isSeen,
  lastView,
}: ListMessageProps) {
  const { profile } = useAuth();
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const { selectedConversation, socket } = useContext(AppContext);
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    scrollToBottom();
  }, [isTyping, scrollToBottom]);
  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;
    socket.on("typing", (id) => {
      if (id !== selectedConversation?._id) return;
      setIsTyping(true);
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      const newTimeoutId = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
      timeoutIdRef.current = newTimeoutId;
    });
    return () => {
      socket.off("typing");
    };
  }, [socket, selectedConversation]);
  return (
    <>
      <div className={`flex justify-start ${isTyping ? "block" : "hidden"}`}>
        <div className="mt-2 px-3 py-2 rounded-[18px] bg-gray1">
          <div className="typing">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      </div>
      {isSeen && selectedConversation && (
        <div className="relative ">
          <div className="h-5 w-5 group rounded-full overflow-hidden bg-orange/20  ml-auto">
            {selectedConversation.user.avatar && (
              <Image
                src={selectedConversation.user.avatar}
                width={100}
                height={100}
                alt=""
                className="w-full h-full"
              />
            )}
            <div className="absolute bottom-full hidden group-hover:block rounded-md right-0 p-1 bg-gray2 text-white text-xs">
              {selectedConversation.user.fullName} đã xem vào lúc{" "}
              {formatDate(lastView)}
            </div>
          </div>
        </div>
      )}
      {listMessage.map((message, idx) => (
        <div key={message._id}>
          <div
            className={`mt-2 animation-bounce  flex ${
              message.message_userId === profile?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[240px]  chat__content px-3 py-2 rounded-[18px] bg-gray1  ${
                message.message_userId === profile?._id
                  ? "bg-orange text-white"
                  : "bg-gray1"
              }`}
            >
              {message.message_content}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

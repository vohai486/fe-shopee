import { AppContext } from "@/contexts/app.context";
import { Conversation } from "@/types";
import { timeSince } from "@/utils";
import Image from "next/image";
import * as React from "react";

export interface SidebarConversationProps {
  listConversation: Conversation[];
  handleSelectConversation: (conversation: Conversation) => void;
}
export function SidebarConversation({
  listConversation,
  handleSelectConversation,
}: SidebarConversationProps) {
  const { selectedConversation } = React.useContext(AppContext);
  return (
    <>
      {listConversation.map((conversation) => (
        <div
          key={conversation._id}
          className={`p-3 relative items-center flex gap-x-2 hover:bg-gray1 cursor-pointer ${
            selectedConversation?._id === conversation._id && "bg-gray1"
          }`}
          onClick={() => {
            handleSelectConversation(conversation);
          }}
        >
          <div className="w-8 shrink-0 h-8 bg-orange/20  overflow-hidden rounded-full">
            {conversation.user.avatar && (
              <Image
                src={conversation.user.avatar}
                width={100}
                height={100}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="grow">
            <div className="flex gap-x-1 items-center justify-between">
              <span className="font-bold text-sm line-clamp-1">
                {conversation.user.fullName}
              </span>
            </div>
            <div className="flex gap-x-1 items-center text-13px text-gray2">
              <span className="line-clamp-1">
                {conversation.message.message_content}
              </span>
              <span className="shrink-0">{"·"}</span>
              <span className="shrink-0">
                {timeSince(conversation.message.createdAt)}
              </span>
            </div>
          </div>
          {!conversation.isSeen && (
            <div className="absolute w-4 h-4 flex items-center justify-center text-xs rounded-full bg-orange text-white right-3"></div>
          )}
        </div>
      ))}
    </>
  );
}

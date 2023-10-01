import { conversationApi, messageApi } from "@/api-client";
import { AppContext } from "@/contexts/app.context";
import { useAuth } from "@/hooks";
import { Conversation } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { FormAddMessage } from "./form-addMessage";
import { ListMessage } from "./list-message";
import { SidebarConversation } from "./sidebar-conversation";

export interface AppProps {
  onClose: () => void;
}

export function ChatBox({ onClose }: AppProps) {
  const { profile } = useAuth();
  const divRef = useRef<HTMLDivElement | null>(null);
  const [type, setType] = useState<"conversation" | "message">("conversation");
  const {
    selectedConversation,
    socket,
    setSelectedConversation,
    listConversation,
  } = useContext(AppContext);
  const [chatBoxExpanded, setChatBoxExpanded] = useState(true);

  const { data: dataMessage } = useQuery({
    queryKey: ["get-messages", selectedConversation?._id],
    staleTime: 60 * 1000,
    queryFn: () =>
      messageApi.getList({
        conversationId: selectedConversation?._id || "",
      }),
    enabled: !!selectedConversation?._id,
  });

  const scrollToBottom = () => {
    if (divRef.current) {
      const scrollHeight = divRef.current.scrollHeight;
      divRef.current.scrollTop = scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [dataMessage]);

  const handleSelectConversation = (conversation: Conversation) => {
    if (!conversation.isSeen && socket && profile) {
      socket.emit("conversation-last-view", {
        conversationId: conversation._id,
        userId: profile?._id,
      });
    }
    setType("message");
    setSelectedConversation({
      _id: conversation._id,
      user: conversation.user,
    });
  };

  return (
    <div className="border rounded-sm shadow-2xl w-full  bg-box border-box">
      <div className="flex justify-between border-box border-b  py-2 px-3">
        <div className="sm:hidden">
          {type === "message" && (
            <button onClick={() => setType("conversation")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-4 h-4 border border-box stroke-grey-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="font-bold text-blue-200">Chat</div>
        <div className="sm:flex  gap-x-2">
          <button
            className="hidden sm:block"
            onClick={() => setChatBoxExpanded(!chatBoxExpanded)}
          >
            {chatBoxExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-4 h-4 border border-box stroke-grey-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-4 h-4 border border-box stroke-grey-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
                />
              </svg>
            )}
          </button>
          <button onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-4 h-4 border border-box stroke-grey-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="sm:flex hidden  h-[460px]">
        <div className="md:w-[230px] w-2[200px]  shrink-0 border-r border-box h-full overflow-y-auto custom-scrollbar">
          {
            <SidebarConversation
              listConversation={listConversation}
              handleSelectConversation={handleSelectConversation}
            />
          }
        </div>
        <div
          className={` h-full flex flex-col  overflow-hidden transition-all ${
            chatBoxExpanded ? "sm:w-[350px] md:w-[410px]" : "w-0"
          }`}
        >
          {selectedConversation?.user._id && (
            <>
              <div className="border-b border-box pl-2 text-sm py-3">
                {selectedConversation.user.fullName}
              </div>
              <div
                ref={divRef}
                className="px-2 h-[300px] pb-2 flex  flex-col-reverse custom-scrollbar overflow-y-auto overflow-x-hidden text-sm "
              >
                {dataMessage?.metadata && (
                  <ListMessage
                    scrollToBottom={scrollToBottom}
                    listMessage={dataMessage.metadata.messages}
                    isSeen={dataMessage.metadata.isSeen}
                    lastView={dataMessage.metadata.lastView}
                  ></ListMessage>
                )}
              </div>

              <FormAddMessage />
            </>
          )}
        </div>
      </div>
      <div className="sm:hidden overflow-x-hidden w-[300px] w400:w-[375px] h-[400px] overflow-y-auto custom-scrollbar">
        <div
          className={`w-full -translate-x-full h-0 opacity-0 overflow-x-hidden ${
            type === "conversation" && "w-full translate-x-0 opacity-100 h-full"
          }`}
        >
          <SidebarConversation
            listConversation={listConversation}
            handleSelectConversation={handleSelectConversation}
          />
        </div>
        <div
          className={`w-0 h-0 -translate-x-full ${
            type === "message" && "w-full h-full translate-x-0 "
          }  flex flex-col overflow-hidden transition-all`}
        >
          {selectedConversation?.user._id && (
            <>
              <div className="border-b border-gray1 pl-2 text-sm py-3">
                {selectedConversation?.user.fullName}
              </div>
              <div
                ref={divRef}
                className="px-2 h-[250px]  pb-2 flex  flex-col-reverse custom-scrollbar overflow-y-auto overflow-x-hidden text-sm "
              >
                {dataMessage?.metadata && (
                  <ListMessage
                    isSeen={dataMessage.metadata.isSeen}
                    scrollToBottom={scrollToBottom}
                    listMessage={dataMessage.metadata.messages}
                    lastView={dataMessage.metadata.lastView}
                  ></ListMessage>
                )}
              </div>

              <FormAddMessage />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

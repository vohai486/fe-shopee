import { ChatBox } from "./chat-box";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { conversationApi } from "@/api-client";
import { useAuth } from "@/hooks";
import { useContext, useEffect } from "react";
import { AppContext } from "@/contexts/app.context";
import { ChatPortal } from "./chat-portal";
export function ChatFrame() {
  const { profile } = useAuth();
  const {
    showChatBox,
    setShowChatBox,
    setListConversation,
    selectedConversation,
    socket,
    setSelectedConversation,
  } = useContext(AppContext);
  const { data: dataConversation, refetch } = useQuery({
    queryKey: ["get-conversation"],
    queryFn: conversationApi.getList,
    staleTime: 60 * 1000,
  });
  useEffect(() => {
    if (!socket || !dataConversation?.metadata) return;
    setListConversation(dataConversation.metadata);
    socket.emit(
      "join-conversations",
      dataConversation?.metadata.map((conversation) => conversation._id)
    );
    const foundConversation = dataConversation?.metadata.find(
      (ele) => ele._id === selectedConversation?._id
    );
    if (foundConversation) {
      setSelectedConversation(() => ({
        _id: foundConversation._id,
        user: foundConversation.user,
      }));
    }
  }, [
    dataConversation,
    selectedConversation?._id,
    setListConversation,
    setSelectedConversation,
    socket,
  ]);

  const ButtonShowChatBox = (
    <div className="relavtive">
      <button
        onClick={() => setShowChatBox(true)}
        className="px-3 py-2  rounded-sm bg-blue-200 text-grey-0 flex items-center gap-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
        <span className="font-bold text-lg">Chat</span>
      </button>
      {dataConversation?.metadata &&
        dataConversation.metadata.filter((item) => !item.isSeen).length > 0 && (
          <div className="w-5 h-5 flex items-center justify-center border absolute rounded-full text-sm bg-blue-200 text-grey-0 -top-1/4 -right-1">
            <span>
              {dataConversation.metadata.filter((item) => !item.isSeen).length}
            </span>
          </div>
        )}
    </div>
  );
  if (!profile?._id) {
    return null;
  }
  return (
    <ChatPortal>
      {showChatBox ? (
        <ChatBox onClose={() => setShowChatBox(false)} />
      ) : (
        ButtonShowChatBox
      )}
    </ChatPortal>
  );
}

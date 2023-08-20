import { AppContext } from "@/contexts/app.context";
import { useAuth } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

export function SocketInitializer() {
  const { pathname } = useRouter();
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { socket, selectedConversation, setSelectedConversation } =
    useContext(AppContext);
  useEffect(() => {
    if (profile?._id && socket) {
      socket.emit("join", profile._id);
    }
  }, [profile, socket]);
  useEffect(() => {
    if (!socket || !profile?._id) return;
    socket.on("new-message", (id) => {
      queryClient.invalidateQueries(["get-conversation"]);
      if (selectedConversation?._id === "") {
        setSelectedConversation((prev) => prev && { ...prev, _id: id });
      }
      if (selectedConversation?._id === id) {
        queryClient.invalidateQueries(["get-messages", id]);
      }
    });
    socket.on("conversation-last-view", (conversationId) => {
      if (!socket) return;
      queryClient.invalidateQueries(["get-conversation"]);

      if (conversationId === selectedConversation?._id) {
        queryClient.invalidateQueries(["get-messages", conversationId]);
      }
    });
    socket.on("join-group", (conversationId) => {
      if (selectedConversation && selectedConversation._id === "") {
        setSelectedConversation(
          (prev) =>
            prev && {
              ...prev,
              _id: conversationId,
            }
        );
      }
      socket.emit("join-group", conversationId);
    });
    socket.on("new-notify", ({ content, idOrder, type }) => {
      if (type === "user" && !pathname.includes("seller")) {
        toast.info(content, {
          autoClose: 3000,
          hideProgressBar: true,
        });
        queryClient.invalidateQueries(["notify"]);
      }
      if (type === "shop" && pathname.includes("seller")) {
        toast.info(content, {
          autoClose: 3000,
          hideProgressBar: true,
        });
        queryClient.invalidateQueries(["notify-shop"]);
      }
    });
    return () => {
      socket.off("new-message");
      socket.off("conversation-last-view");
      socket.off("join-group");
      socket.off("new-notify");
    };
  }, [
    pathname,
    profile?._id,
    queryClient,
    selectedConversation,
    setSelectedConversation,
    socket,
  ]);
  // Setup the Socket
  return <div></div>;
}

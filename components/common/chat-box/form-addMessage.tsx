import { messageApi } from "@/api-client";
import { TextareaField } from "@/components/form";
import { AppContext } from "@/contexts/app.context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, KeyboardEvent, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = {
  content: string;
};
export interface AppProps {
  onClose: () => void;
}
const schema = yup.object().shape({
  content: yup.string().trim().required(""),
});
export function FormAddMessage() {
  const { selectedConversation, socket } = useContext(AppContext);
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      content: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", selectedConversation?._id);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(handleSendMessage)();
    }
  };
  const addTextMutation = useMutation({
    mutationFn: messageApi.addText,
  });
  const handleSendMessage = async (values: FormData) => {
    if (selectedConversation) {
      addTextMutation.mutate({
        content: values.content,
        receiverId: selectedConversation.user._id || "",
      });
      setValue("content", "");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(handleSendMessage)}
      className="border-t border-box"
    >
      <TextareaField
        className="text-sm w-full p-2 border border-transparent  dark:border-transparent bg-transparent dark:bg-transparent resize-none outline-none"
        classTextError="hidden"
        control={control}
        name="content"
        onChange={handleTyping}
        onKeyDown={handleKeyDown}
        placeholder="Nhập nội dung"
      />

      <div className="flex justify-between px-2 pb-3">
        <div className="flex gap-x-2">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-blue-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
              />
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-blue-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-blue-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-blue-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </button>
        </div>
        <button type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-5 h-5 stroke-blue-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

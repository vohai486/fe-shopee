import { useAuth } from "@/hooks";
import {
  Conversation,
  ExtendCartItem,
  SelectedConversation,
  VoucherPayload,
} from "@/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface AppContextInterface {
  listItemCart: ExtendCartItem[];
  setListItemCart: Dispatch<SetStateAction<ExtendCartItem[]>>;
  listDiscount: VoucherPayload[];
  setListDiscount: Dispatch<SetStateAction<VoucherPayload[]>>;
  showChatBox: boolean;
  setShowChatBox: Dispatch<SetStateAction<boolean>>;
  selectedConversation: SelectedConversation | null;
  setSelectedConversation: Dispatch<
    SetStateAction<SelectedConversation | null>
  >;
  socket: Socket | null;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
  listConversation: Conversation[];
  setListConversation: Dispatch<SetStateAction<Conversation[]>>;
}
const initialAppContext = {
  listItemCart: [],
  setListItemCart: () => {},
  listDiscount: [],
  setListDiscount: () => {},
  showChatBox: false,
  setShowChatBox: () => {},
  selectedConversation: null,
  setSelectedConversation: () => {},
  socket: null,
  setSocket: () => {},
  listConversation: [],
  setListConversation: () => {},
};
export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useAuth();

  const [listItemCart, setListItemCart] = useState<ExtendCartItem[]>([]);
  const [listDiscount, setListDiscount] = useState<VoucherPayload[]>([]);
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] =
    useState<SelectedConversation | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [listConversation, setListConversation] = useState<Conversation[]>([]);
  useEffect(() => {
    if (!profile?._id) return;
    const newSocket = io(process.env.API_URL as string);
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [profile]);

  return (
    <AppContext.Provider
      value={{
        listItemCart,
        showChatBox,
        setShowChatBox,
        setListItemCart,
        listDiscount,
        setListDiscount,
        selectedConversation,
        setSelectedConversation,
        socket,
        setSocket,
        listConversation,
        setListConversation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

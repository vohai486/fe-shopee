import { useClickOutSide } from "@/hooks";
import {
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const MenusContext = createContext<{
  openId: string;
  close: () => void;
  open: Dispatch<SetStateAction<string>>;
  position: { x: number; y: number } | null;
  setPosition: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
    } | null>
  >;
}>({
  openId: "",
  close: () => {},
  open: () => {},
  position: null,
  setPosition: () => {},
});

export function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const close = () => {
    setOpenId("");
    setPosition(null);
  };
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{
        openId,
        close,
        open,
        position,
        setPosition,
      }}
    >
      {children}
    </MenusContext.Provider>
  );
}
function Toggle({ id }: { id: string }) {
  const { openId, close, open, setPosition, position } =
    useContext(MenusContext);
  function handleClick(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const rect = target.closest("button")?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
      });
    }
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <button
      className="flex justify-center p-1 rounded-md "
      onClick={(e) => handleClick(e)}
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
          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      </svg>
    </button>
  );
}
function Menu({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

function List({ id, children }: { id: string; children: ReactNode }) {
  const { openId, close, position } = useContext(MenusContext);
  const ref = useRef(null);
  useClickOutSide(ref, close);

  if (id !== openId) return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        right: position?.x,
        top: position?.y,
      }}
      className="overflow-hidden  fixed border border-box bg-box shadow-sm-50 rounded-md "
    >
      {children}
    </div>,
    document.body
  );
}
function Button({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <div>
      <button
        className=" text-left w-full py-3 px-6 text-sm flex items-center gap-4 hover:bg-blue-200 hover:text-grey-0"
        onClick={handleClick}
      >
        {icon}
        <span>{children}</span>
      </button>
    </div>
  );
}
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Menu = Menu;
Menus.Button = Button;

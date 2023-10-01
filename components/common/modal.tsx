import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface ModalProps {}

const ModalContext = createContext<{
  openName: string;
  close: () => void;
  open: Dispatch<SetStateAction<string>>;
}>({
  openName: "",
  close: () => {},
  open: () => {},
});

export function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}
function Open({
  children,
  opens: opensWindowName,
}: {
  children: ReactElement<any>;
  opens: string;
}) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: () => {
      open(opensWindowName);
    },
  });
}
function Window({
  children,
  name,
}: {
  children: ReactElement<any>;
  name: string;
}) {
  const { openName, close } = useContext(ModalContext);
  if (openName !== name) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-screen z-[1000] bg-backdrop dark:bg-backdrop-dark backdrop-blur-sm transition-all ease-in-out ">
      <div className="fixed top-1/2 rounded-md left-1/2 -translate-x-1/2 -translate-y-1/2 bg-box border border-box shadow-md py-8 transition-all ease-in-out">
        <button
          className="bg-none border-none p-1 rounded-md translate-x-2 absolute top-3 right-5"
          onClick={close}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}
Modal.Open = Open;
Modal.Window = Window;

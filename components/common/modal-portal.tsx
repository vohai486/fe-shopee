import { useClickOutSide } from "@/hooks";
import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export function ModalPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return (
    <>
      {mounted
        ? createPortal(
            <div
              id="modal-container"
              className={`fixed inset-0 px-2 text-sm bg-gray4/50  z-[1000] ${
                mounted ? " open" : " out open"
              } `}
            >
              <div className="modal-background w-full h-full flex justify-center items-center">
                {children}
              </div>
            </div>,
            document.getElementById("modal-root") as Element | DocumentFragment
          )
        : null}
    </>
  );
}

interface ModalContextInterface {
  openName: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
}
const ModalContext = createContext<ModalContextInterface>({
  open: () => {},
  openName: "",
  close: () => {},
});

function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState("");

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
  children: ReactElement;
  opens: string;
}) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}
function Window({ children, name }: { children: ReactNode; name: string }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useRef(null);
  useClickOutSide(ref, close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 "></div>,
    // <Overlay>
    //   <StyledModal ref={ref}>
    //     <Button onClick={close}>
    //       <HiXMark />
    //     </Button>

    //     <div>{cloneElement(children, { onCloseModal: close })}</div>
    //   </StyledModal>
    // </Overlay>,
    document.body
  );
}

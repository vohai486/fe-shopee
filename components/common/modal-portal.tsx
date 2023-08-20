import { ReactNode, useEffect, useState } from "react";
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

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ChatPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  return (
    <>
      {mounted
        ? createPortal(
            <div className={`fixed  bottom-0 right-1 z-50 `}>{children}</div>,
            document.getElementById("chatbox-root") as
              | Element
              | DocumentFragment
          )
        : null}
    </>
  );
}

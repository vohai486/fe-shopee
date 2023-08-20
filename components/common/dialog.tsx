import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
};

export function Diaglog(props: Props) {
  const { query } = useRouter();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const { showDialog } = query;
  useEffect(() => {
    if (showDialog === "y") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showDialog]);
  return <div></div>;
}

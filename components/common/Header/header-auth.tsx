import Link from "next/link";
import * as React from "react";
import Logo from "../logo";

export function HeaderAuth() {
  return (
    <header className="bg-grey-0 dark:bg-grey-0-dark">
      <div className="container px-2 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <span className="text-brand-500 text-sm">Bạn cần giúp đỡ gì?</span>
        </nav>
      </div>
    </header>
  );
}

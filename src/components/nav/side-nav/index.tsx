"use client";

import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import BrandFooter from "./components/visactor";
import Navigation from "./components/navigation";
import BrandHeader from "./components/user";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        className={cn(
          "fixed left-0 top-12 z-50 rounded-r-md bg-muted px-2 py-1.5 text-foreground shadow-md hover:bg-muted/80 tablet:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-52" : "translate-x-0",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ArrowLeftToLine size={16} />
        ) : (
          <ArrowRightToLine size={16} />
        )}
      </button>
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-40 flex h-[100dvh] w-52 shrink-0 flex-col border-r border-border bg-card tablet:sticky tablet:translate-x-0",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <BrandHeader />
        <Navigation />
        <BrandFooter />
      </aside>
    </>
  );
}

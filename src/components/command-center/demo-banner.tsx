"use client";

import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ascend.demoBanner.dismissed";

export function DemoBanner() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // localStorage can throw in private mode — treat as not dismissed.
    }
  }, []);

  if (!mounted || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // no-op
    }
  }

  return (
    <div
      role="status"
      className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2.5"
    >
      <Info
        className="h-4 w-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
        Demo Mode
      </span>
      <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        Sample data shown. Connect CRM to populate live pipeline.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss demo mode notice"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

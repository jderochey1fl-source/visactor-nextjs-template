"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsVariant = "pill" | "prominent";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  variant: TabsVariant;
};
const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  className,
  variant = "pill",
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  /**
   * "pill" — compact muted pills (default). Use for sub-tabs inside a card.
   * "prominent" — larger underlined tabs in Ladder hot-orange. Use for the
   *   primary navigation inside a tab/page (Playbook, Agent, A/B Lab) so
   *   first-time viewers can see the available views at a glance.
   */
  variant?: TabsVariant;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const value = controlled ?? internal;
  const setValue = React.useCallback(
    (v: string) => {
      if (controlled === undefined) setInternal(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange],
  );
  return (
    <TabsContext.Provider value={{ value, setValue, variant }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { variant } = useTabs();
  if (variant === "prominent") {
    return (
      <div
        role="tablist"
        className={cn(
          "flex items-center gap-1 border-b border-border",
          className,
        )}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1 rounded-md border border-border bg-muted/60 p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { value: active, setValue, variant } = useTabs();
  const isActive = active === value;

  if (variant === "prominent") {
    return (
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => setValue(value)}
        className={cn(
          "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-[15px] font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background -mb-px",
          isActive
            ? "border-hot text-hot"
            : "border-transparent text-muted-foreground hover:text-foreground",
          className,
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow"
          : "hover:bg-background/60",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { value: active } = useTabs();
  if (active !== value) return null;
  return (
    <div
      role="tabpanel"
      className={cn(
        "mt-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

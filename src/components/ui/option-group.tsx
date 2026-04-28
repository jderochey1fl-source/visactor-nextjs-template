"use client";

import { HelpCircle } from "lucide-react";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * OptionGroup — a prominent, orange-accented selector for the kinds of
 * "configurable variables" that previously read like body text and got
 * missed by first-time viewers (focus toggle in Research, variable +
 * metric pickers in A/B Testing, etc.).
 *
 * Visual contract:
 *   - Bold uppercase label in Ladder hot-orange so it jumps off the page
 *   - Optional question-mark icon that opens a tooltip popover with a
 *     short explanation of what the option controls
 *   - Pill buttons with a clearly-active orange state (bg-hot + white
 *     text + shadow) so the current selection is unambiguous
 *   - Inactive pills carry a 1px border so the affordance reads as
 *     "clickable", not as decorative text
 */

export type OptionGroupItem<T extends string> = {
  value: T;
  label: React.ReactNode;
  /** Optional small monospace prefix, e.g. "#1" rank tags in A/B Testing. */
  prefix?: React.ReactNode;
};

type OptionGroupProps<T extends string> = {
  label: string;
  /** Optional plain-language help shown in a popover when the user clicks the (?) icon. */
  help?: React.ReactNode;
  options: ReadonlyArray<OptionGroupItem<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** When true, options stretch to fill the row evenly. Default: false (auto width). */
  fullWidth?: boolean;
};

export function OptionGroup<T extends string>({
  label,
  help,
  options,
  value,
  onChange,
  className,
  fullWidth = false,
}: OptionGroupProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-hot">
          {label}
        </span>
        {help ? <HelpTip>{help}</HelpTip> : null}
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "flex flex-wrap gap-1.5",
          fullWidth && "w-full",
        )}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                fullWidth && "flex-1 justify-center",
                active
                  ? "border-hot bg-hot text-white shadow-sm"
                  : "border-border bg-card text-foreground/80 hover:border-hot/40 hover:bg-hot/5 hover:text-foreground",
              )}
            >
              {opt.prefix ? (
                <span
                  className={cn(
                    "font-mono text-[10px] font-semibold",
                    active ? "text-white/80" : "text-muted-foreground",
                  )}
                >
                  {opt.prefix}
                </span>
              ) : null}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * HelpTip — a question-mark trigger that opens a small popover with a
 * plain-language explanation. Used inside OptionGroup but also exported
 * so other surfaces (form labels, table headers) can adopt the same
 * "first-time viewers don't have to guess" pattern.
 */
export function HelpTip({
  children,
  ariaLabel = "What does this mean?",
}: {
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-hot focus-visible:text-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 border-hot/30 text-sm leading-relaxed"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

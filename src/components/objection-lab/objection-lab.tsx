"use client";

import {
  ArrowLeft,
  Library,
  PhoneOff,
  Plus,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { AnalysisEditor } from "@/components/objection-lab/analysis-editor";
import { LibraryList } from "@/components/objection-lab/library-list";
import { LoggerForm } from "@/components/objection-lab/logger-form";
import { TopRebuttalFactors } from "@/components/objection-lab/top-rebuttal-factors";
import { Button } from "@/components/ui/button";
import { useLoggedObjections } from "@/lib/objection-store";
import { cn } from "@/lib/utils";
import type { LoggedObjection } from "@/types/types";

type View =
  | { mode: "library" }
  | { mode: "logger" }
  | { mode: "detail"; draft: LoggedObjection; isNew: boolean };

export function ObjectionLab() {
  const { list, hydrated, upsert, remove, incrementRoleplay } =
    useLoggedObjections();
  const [view, setView] = useState<View>({ mode: "library" });

  const gotoLibrary = () => setView({ mode: "library" });
  const gotoLogger = () => setView({ mode: "logger" });

  return (
    <div className="flex w-full flex-col">
      <Header
        mode={view.mode}
        onGotoLibrary={gotoLibrary}
        onGotoLogger={gotoLogger}
        libraryCount={list.length}
      />

      <DangerCallout />

      <TopRebuttalFactors />

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        {view.mode === "library" ? (
          hydrated ? (
            <LibraryList
              items={list}
              onOpen={(draft) =>
                setView({ mode: "detail", draft, isNew: false })
              }
              onDelete={remove}
              onLogNew={gotoLogger}
            />
          ) : (
            <div className="h-40 animate-pulse rounded-md border border-border bg-card" />
          )
        ) : null}

        {view.mode === "logger" ? (
          <LoggerForm
            onAnalyzed={(draft) =>
              setView({ mode: "detail", draft, isNew: true })
            }
            onCancel={gotoLibrary}
          />
        ) : null}

        {view.mode === "detail" ? (
          <AnalysisEditor
            draft={view.draft}
            isNew={view.isNew}
            onSave={(next) => {
              upsert(next);
              gotoLibrary();
            }}
            onDiscard={() => (view.isNew ? gotoLogger() : gotoLibrary())}
            onRoleplayPassed={(id) => incrementRoleplay(id)}
          />
        ) : null}
      </main>
    </div>
  );
}

function Header({
  mode,
  onGotoLibrary,
  onGotoLogger,
  libraryCount,
}: {
  mode: View["mode"];
  onGotoLibrary: () => void;
  onGotoLogger: () => void;
  libraryCount: number;
}) {
  return (
    <header className="border-b border-border bg-card/40 px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {mode === "detail" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onGotoLibrary}
              className="gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          ) : null}
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight">
              Objection Lab
            </h1>
            <p className="text-xs text-muted-foreground">
              Log, analyze, and pressure-test every objection you hear.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TabButton
            active={mode === "library"}
            onClick={onGotoLibrary}
            icon={Library}
            label={`Library · ${libraryCount}`}
          />
          <TabButton
            active={mode === "logger"}
            onClick={onGotoLogger}
            icon={Plus}
            label="Log New"
          />
        </div>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-hot bg-hot text-white shadow-sm"
          : "border-border bg-card text-foreground/80 hover:border-hot/40 hover:bg-hot/5 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function DangerCallout() {
  return (
    <div className="border-b border-border bg-destructive/5 px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-destructive/15 text-destructive">
          <PhoneOff className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-destructive">
            The most dangerous objection
          </p>
          <p className="text-sm text-foreground">
            <span className="font-semibold">Silence after a proposal</span> is
            more dangerous than any verbal objection. No acknowledgment in 24h
            after sending a proposal — <span className="font-semibold">call,
            do not email</span>. A phone call creates accountability an email
            never will.
          </p>
        </div>
        <ShieldAlert className="mt-1 hidden h-5 w-5 shrink-0 text-destructive/60 tablet:block" />
      </div>
    </div>
  );
}

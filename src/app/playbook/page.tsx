import { PlaybookBrowser } from "@/components/playbook/playbook-browser";

export default function PlaybookPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          Playbook
        </h1>
        <p className="text-sm text-muted-foreground">
          Objection scripts, stage checklists, and battle-tested frameworks.
        </p>
      </header>
      <PlaybookBrowser />
    </div>
  );
}

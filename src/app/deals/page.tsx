import { PipelineBoard } from "@/components/deals/pipeline-board";

export default function DealsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          LADDER Pipeline
        </h1>
        <p className="text-sm text-muted-foreground">
          Every active deal, mapped to the exact LADDER stage it&apos;s stuck in.
        </p>
      </header>
      <PipelineBoard />
    </div>
  );
}

import { Clock } from "lucide-react";
import Container from "../container";

export default function TopNav({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <Container className="flex h-16 items-center justify-between gap-6 border-b border-border">
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground tablet:flex">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="font-mono uppercase tracking-wider">Live</span>
          <span className="text-border">|</span>
          <Clock className="h-3 w-3" />
          <span className="font-mono">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        {action}
      </div>
    </Container>
  );
}

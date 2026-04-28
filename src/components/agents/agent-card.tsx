import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Agent } from "@/data/agents";

export function AgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  const isActive = agent.status === "active";

  const Wrapper = isActive ? Link : "div";
  const wrapperProps = isActive
    ? { href: agent.href }
    : { "aria-disabled": true };

  return (
    <Wrapper
      {...(wrapperProps as object)}
      className={cn(
        "group relative block",
        !isActive && "cursor-not-allowed",
      )}
    >
      <Card
        className={cn(
          "h-full transition-all",
          isActive
            ? "hover:border-hot/50 hover:shadow-md"
            : "opacity-65 saturate-50",
        )}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-md border",
                isActive
                  ? "border-hot/30 bg-hot/10 text-hot"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            {agent.signal ? (
              <Badge
                variant={isActive ? "hot" : "outline"}
                className="font-mono text-[10px] uppercase tracking-wider"
              >
                {agent.signal}
              </Badge>
            ) : null}
          </div>
          <CardTitle className="mt-3">{agent.name}</CardTitle>
          <CardDescription>{agent.tagline}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {agent.description}
          </p>
          {isActive ? (
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-hot transition-transform group-hover:translate-x-0.5">
              Open
              <ArrowRight className="h-4 w-4" />
            </div>
          ) : (
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              Coming soon
            </div>
          )}
        </CardContent>
      </Card>
    </Wrapper>
  );
}

import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function BrandFooter() {
  return (
    <div className="relative flex flex-col gap-3 border-t border-border px-3 py-3">
      <div className="dot-matrix absolute left-0 top-0 -z-10 h-full w-full opacity-40" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-hot" />
          <span className="font-medium">Powered by Claude</span>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="font-mono uppercase tracking-wider">ASCEND v1.0</span>
        <span className="font-mono">us-east</span>
      </div>
    </div>
  );
}

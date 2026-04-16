import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function BrandHeader() {
  return (
    <div className="flex h-16 items-center border-b border-border px-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandMark />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight">
              {siteConfig.brand.name}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {siteConfig.brand.tagline}
            </span>
          </div>
        </div>
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20 L10 10 L14 16 L20 4" />
        <path d="M14 4 L20 4 L20 10" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-hot ring-2 ring-background" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigations } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-grow flex-col gap-y-0.5 p-2">
      <div className="mb-2 px-2 pt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Workspace
      </div>
      {navigations.map((navigation) => {
        const Icon = navigation.icon;
        const active =
          navigation.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(navigation.href);
        return (
          <Link
            key={navigation.name}
            href={navigation.href}
            className={cn(
              "group relative flex items-center rounded-md px-2 py-2 transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
            )}
            <Icon
              size={16}
              className={cn(
                "mr-2.5 shrink-0",
                active
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span className="text-sm font-medium">{navigation.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

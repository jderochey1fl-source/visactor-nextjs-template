import { Linkedin, Lock, Mail, Phone } from "lucide-react";
import type { DecisionMaker } from "@/data/trigger-hunter-mock";

export function DecisionMakers({ contacts }: { contacts: DecisionMaker[] }) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          No decision-maker contacts enriched yet. Apollo pass will fill these on
          the next sweep.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {contacts.map((c) => (
        <li
          key={c.name}
          className="flex flex-col gap-2 rounded-md border border-border/60 bg-card p-3 tablet:flex-row tablet:items-center tablet:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {c.linkedinHandle && (
              <a
                href={`https://www.linkedin.com/in/${c.linkedinHandle}/`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-muted"
              >
                <Linkedin className="h-3 w-3" />
                LinkedIn
              </a>
            )}
            {c.emailMasked && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-[10px] font-mono text-muted-foreground">
                <Mail className="h-3 w-3" />
                {c.emailMasked}
              </span>
            )}
            {c.phoneMasked && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-[10px] font-mono text-muted-foreground">
                <Phone className="h-3 w-3" />
                {c.phoneMasked}
              </span>
            )}
            {!c.emailMasked && !c.phoneMasked && (
              <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-[10px] text-muted-foreground">
                <Lock className="h-3 w-3" />
                contact pending enrichment
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

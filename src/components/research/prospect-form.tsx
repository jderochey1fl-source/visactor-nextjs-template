"use client";

import { Building2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ProspectInput = {
  companyName: string;
  contactName?: string;
  contactTitle?: string;
  website?: string;
  hqCity: string;
  hqState: string;
  estHeadcount: "under-25" | "25-50" | "50-100" | "100-200" | "200-plus";
  primaryMotion:
    | "residential-storm"
    | "residential-retail"
    | "commercial"
    | "mixed";
  focus: "smarthire" | "smartterritory" | "both";
};

const samples: ProspectInput[] = [
  {
    companyName: "Crestline Roofing",
    contactName: "Derek Hollis",
    contactTitle: "VP of Sales",
    website: "crestlineroofing.com",
    hqCity: "Plano",
    hqState: "TX",
    estHeadcount: "50-100",
    primaryMotion: "residential-storm",
    focus: "both",
  },
  {
    companyName: "Apex Exterior Solutions",
    contactName: "Marisol Parker",
    contactTitle: "Owner / Operator",
    website: "apexexteriors.com",
    hqCity: "Charlotte",
    hqState: "NC",
    estHeadcount: "25-50",
    primaryMotion: "residential-retail",
    focus: "smarthire",
  },
];

const motionLabels: Record<ProspectInput["primaryMotion"], string> = {
  "residential-storm": "Residential storm restoration",
  "residential-retail": "Residential retail / lead gen",
  commercial: "Commercial focus",
  mixed: "Mixed residential + commercial",
};

const headcountLabels: Record<ProspectInput["estHeadcount"], string> = {
  "under-25": "Under 25 (too small)",
  "25-50": "25 – 50",
  "50-100": "50 – 100",
  "100-200": "100 – 200",
  "200-plus": "200+ (too large)",
};

export function ProspectForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (input: ProspectInput) => void;
  disabled?: boolean;
}) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [hqCity, setHqCity] = useState("");
  const [hqState, setHqState] = useState("");
  const [estHeadcount, setEstHeadcount] =
    useState<ProspectInput["estHeadcount"]>("50-100");
  const [primaryMotion, setPrimaryMotion] =
    useState<ProspectInput["primaryMotion"]>("residential-storm");
  const [focus, setFocus] =
    useState<ProspectInput["focus"]>("both");

  const outOfIcp =
    estHeadcount === "under-25" || estHeadcount === "200-plus";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      companyName,
      contactName: contactName || undefined,
      contactTitle: contactTitle || undefined,
      website: website || undefined,
      hqCity,
      hqState,
      estHeadcount,
      primaryMotion,
      focus,
    });
  };

  const quickFill = (s: ProspectInput) => {
    setCompanyName(s.companyName);
    setContactName(s.contactName ?? "");
    setContactTitle(s.contactTitle ?? "");
    setWebsite(s.website ?? "");
    setHqCity(s.hqCity);
    setHqState(s.hqState);
    setEstHeadcount(s.estHeadcount);
    setPrimaryMotion(s.primaryMotion);
    setFocus(s.focus);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Research a roofing company
        </h2>
        <p className="text-xs text-muted-foreground">
          Ladder sells to roofing companies, not homeowners. Drop in the
          prospect and five agents produce a pre-call card.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName">Company name</Label>
        <Input
          id="companyName"
          placeholder="e.g. Crestline Roofing"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hqCity">HQ city</Label>
          <Input
            id="hqCity"
            placeholder="Plano"
            value={hqCity}
            onChange={(e) => setHqCity(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hqState">State</Label>
          <Input
            id="hqState"
            placeholder="TX"
            maxLength={3}
            value={hqState}
            onChange={(e) => setHqState(e.target.value.toUpperCase())}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="website">Website (optional)</Label>
        <Input
          id="website"
          placeholder="crestlineroofing.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactName">Contact name (optional)</Label>
          <Input
            id="contactName"
            placeholder="Derek Hollis"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactTitle">Title (optional)</Label>
          <Input
            id="contactTitle"
            placeholder="VP of Sales"
            value={contactTitle}
            onChange={(e) => setContactTitle(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="estHeadcount">Est. headcount</Label>
        <select
          id="estHeadcount"
          value={estHeadcount}
          onChange={(e) =>
            setEstHeadcount(e.target.value as ProspectInput["estHeadcount"])
          }
          disabled={disabled}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {(
            Object.keys(headcountLabels) as ProspectInput["estHeadcount"][]
          ).map((k) => (
            <option key={k} value={k}>
              {headcountLabels[k]}
            </option>
          ))}
        </select>
        {outOfIcp ? (
          <p className="text-[11px] text-hot">
            Out of ICP — Ladder targets 25–200 employees.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="primaryMotion">Primary sales motion</Label>
        <select
          id="primaryMotion"
          value={primaryMotion}
          onChange={(e) =>
            setPrimaryMotion(
              e.target.value as ProspectInput["primaryMotion"],
            )
          }
          disabled={disabled}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {(
            Object.keys(motionLabels) as ProspectInput["primaryMotion"][]
          ).map((k) => (
            <option key={k} value={k}>
              {motionLabels[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Product focus</Label>
        <div className="inline-flex h-10 items-center rounded-md border border-input bg-background p-1">
          {(
            [
              { value: "both", label: "Both" },
              { value: "smarthire", label: "SmartHire" },
              { value: "smartterritory", label: "SmartTerritory" },
            ] as { value: ProspectInput["focus"]; label: string }[]
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => setFocus(opt.value)}
              className={`flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors ${
                focus === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={disabled || !companyName || !hqCity || !hqState}
      >
        <Zap className="h-4 w-4" />
        {disabled ? "Running..." : "Run research"}
      </Button>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Quick fill
        </div>
        <div className="flex flex-col gap-1.5">
          {samples.map((s) => (
            <button
              key={s.companyName}
              type="button"
              onClick={() => quickFill(s)}
              disabled={disabled}
              className="group flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:opacity-50"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">
                  {s.companyName}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {s.hqCity}, {s.hqState} · {headcountLabels[s.estHeadcount]} ·{" "}
                  {motionLabels[s.primaryMotion]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

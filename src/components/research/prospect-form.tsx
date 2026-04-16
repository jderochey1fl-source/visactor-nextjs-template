"use client";

import { Home, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ProspectInput = {
  name: string;
  address: string;
  propertyType: "residential" | "commercial";
  source: "storm" | "referral" | "canvass" | "inbound" | "partner";
};

const samples: ProspectInput[] = [
  {
    name: "Marco Delgado",
    address: "2184 Birchfield Ln, Lewisville, TX",
    propertyType: "residential",
    source: "storm",
  },
  {
    name: "Willow Creek HOA",
    address: "Willow Creek Community, Frisco, TX",
    propertyType: "commercial",
    source: "inbound",
  },
];

export function ProspectForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (input: ProspectInput) => void;
  disabled?: boolean;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] =
    useState<ProspectInput["propertyType"]>("residential");
  const [source, setSource] =
    useState<ProspectInput["source"]>("storm");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, address, propertyType, source });
  };

  const quickFill = (s: ProspectInput) => {
    setName(s.name);
    setAddress(s.address);
    setPropertyType(s.propertyType);
    setSource(s.source);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Run prospect research
        </h2>
        <p className="text-xs text-muted-foreground">
          Five agents run in parallel and produce a call prep card.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Prospect name</Label>
        <Input
          id="name"
          placeholder="e.g. Marco Delgado"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address">Property address</Label>
        <Input
          id="address"
          placeholder="e.g. 2184 Birchfield Ln, Lewisville, TX"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label>Type</Label>
          <SegmentedControl
            value={propertyType}
            onChange={(v) =>
              setPropertyType(v as ProspectInput["propertyType"])
            }
            options={[
              { value: "residential", label: "Residential" },
              { value: "commercial", label: "Commercial" },
            ]}
            disabled={disabled}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Source</Label>
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as ProspectInput["source"])
            }
            disabled={disabled}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="storm">Storm</option>
            <option value="referral">Referral</option>
            <option value="canvass">Canvass</option>
            <option value="inbound">Inbound</option>
            <option value="partner">Partner</option>
          </select>
        </div>
      </div>

      <Button type="submit" disabled={disabled || !name || !address}>
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
              key={s.name}
              type="button"
              onClick={() => quickFill(s)}
              disabled={disabled}
              className="group flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:opacity-50"
            >
              <Home className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{s.name}</span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {s.address}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

function SegmentedControl({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex h-10 items-center rounded-md border border-input bg-background p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-sm px-3 py-1 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

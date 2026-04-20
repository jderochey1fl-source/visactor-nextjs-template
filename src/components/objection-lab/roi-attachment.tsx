"use client";

import { Calculator, Check, Copy, Trash2, Users, Map } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  computeHiringRoi,
  computeTerritoryRoi,
  formatMoney,
  HIRING_DEFAULTS,
  roiLabel,
  TERRITORY_DEFAULTS,
} from "@/lib/ladder-roi";
import { cn } from "@/lib/utils";
import type {
  HiringRoiInputs,
  RoiAttachment,
  RoiKind,
  TerritoryRoiInputs,
} from "@/types/types";

type Props = {
  value?: RoiAttachment;
  onChange: (next: RoiAttachment | undefined) => void;
  onClose: () => void;
};

export function RoiAttachmentEditor({ value, onChange, onClose }: Props) {
  const initialKind: RoiKind = value?.kind ?? "hiring-waste";
  const [kind, setKind] = useState<RoiKind>(initialKind);

  const [hiringInputs, setHiringInputs] = useState<HiringRoiInputs>(
    value?.kind === "hiring-waste" ? value.inputs : { ...HIRING_DEFAULTS },
  );
  const [territoryInputs, setTerritoryInputs] = useState<TerritoryRoiInputs>(
    value?.kind === "territory-waste"
      ? value.inputs
      : { ...TERRITORY_DEFAULTS },
  );

  const computed = useMemo<RoiAttachment>(() => {
    return kind === "hiring-waste"
      ? computeHiringRoi(hiringInputs)
      : computeTerritoryRoi(territoryInputs);
  }, [kind, hiringInputs, territoryInputs]);

  function handleAttach() {
    onChange(computed);
    onClose();
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-dashed border-primary/40 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
              ROI attachment
            </p>
            <p className="text-xs text-muted-foreground">
              Optional. Use only when the rebuttal lands better with a dollar
              number behind it.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
          <ModeButton
            icon={Users}
            label="Hiring Waste"
            active={kind === "hiring-waste"}
            onClick={() => setKind("hiring-waste")}
          />
          <ModeButton
            icon={Map}
            label="Territory Waste"
            active={kind === "territory-waste"}
            onClick={() => setKind("territory-waste")}
          />
        </div>
      </div>

      {kind === "hiring-waste" ? (
        <HiringInputs
          value={hiringInputs}
          onChange={setHiringInputs}
        />
      ) : (
        <TerritoryInputs
          value={territoryInputs}
          onChange={setTerritoryInputs}
        />
      )}

      <ResultCard attachment={computed} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          Attaches as a line at the end of this rebuttal&apos;s script.
        </p>
        <div className="flex items-center gap-2">
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange(undefined);
                onClose();
              }}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleAttach}>
            {value ? "Update attachment" : "Attach to rebuttal"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function HiringInputs({
  value,
  onChange,
}: {
  value: HiringRoiInputs;
  onChange: (v: HiringRoiInputs) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
      <NumberField
        label="Sales reps hired / month"
        value={value.salesRepsPerMonth}
        onChange={(n) => onChange({ ...value, salesRepsPerMonth: n })}
        min={0}
        helper="Average over the last 6 months."
      />
      <NumberField
        label="Canvassers hired / month"
        value={value.canvassersPerMonth}
        onChange={(n) => onChange({ ...value, canvassersPerMonth: n })}
        min={0}
        helper="Include anyone you're paying during ramp or tryout."
      />
    </div>
  );
}

function TerritoryInputs({
  value,
  onChange,
}: {
  value: TerritoryRoiInputs;
  onChange: (v: TerritoryRoiInputs) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 tablet:grid-cols-5">
      <NumberField
        label="Canvassers"
        value={value.canvassers}
        onChange={(n) => onChange({ ...value, canvassers: n })}
        min={0}
      />
      <NumberField
        label="Knocks / day"
        value={value.knocksPerCanvasserPerDay}
        onChange={(n) =>
          onChange({ ...value, knocksPerCanvasserPerDay: n })
        }
        min={0}
      />
      <NumberField
        label="Days / month"
        value={value.workingDaysPerMonth}
        onChange={(n) => onChange({ ...value, workingDaysPerMonth: n })}
        min={0}
      />
      <NumberField
        label="Dead-zone %"
        value={value.deadZonePct}
        onChange={(n) => onChange({ ...value, deadZonePct: n })}
        min={0}
        max={100}
        suffix="%"
      />
      <NumberField
        label="Cost / knock"
        value={value.costPerKnock}
        onChange={(n) => onChange({ ...value, costPerKnock: n })}
        min={0}
        prefix="$"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  helper,
  min,
  max,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  helper?: string;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px]">{label}</Label>
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute left-2 text-xs text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <Input
          type="number"
          inputMode="numeric"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          onChange={(e) => {
            const raw = e.target.value;
            const n = raw === "" ? 0 : Number(raw);
            onChange(Number.isFinite(n) ? n : 0);
          }}
          className={cn(
            "h-9 text-sm",
            prefix ? "pl-5" : null,
            suffix ? "pr-6" : null,
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-2 text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {helper ? (
        <p className="text-[10px] text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

function ResultCard({ attachment }: { attachment: RoiAttachment }) {
  const [copied, setCopied] = useState(false);

  async function copySentence() {
    await navigator.clipboard.writeText(attachment.sentence);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-background p-3">
      <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
        <Stat label="Monthly waste" value={formatMoney(attachment.monthlyWaste)} />
        <Stat label="Annual waste" value={formatMoney(attachment.annualWaste)} />
        <Stat
          label="Min save (20%)"
          value={`${formatMoney(attachment.savingsMin)}/mo`}
          tone="success"
        />
        <Stat
          label="Max save (48%)"
          value={`${formatMoney(attachment.savingsMax)}/mo`}
          tone="success"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Preview ({roiLabel(attachment.kind)})
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copySentence}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
        <p className="rounded border border-border/60 bg-muted/30 p-2 text-xs leading-relaxed">
          {attachment.sentence}
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-semibold",
          tone === "success"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-foreground",
        )}
      >
        {value}
      </p>
    </div>
  );
}

"use client";

import {
  Briefcase,
  GraduationCap,
  Headphones,
  MessageSquare,
  PhoneIncoming,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  personas,
  scenarios,
  type Difficulty,
  type Persona,
  type RoleplayMode,
  type Scenario,
} from "@/data/roleplay-scenarios";
import { cn } from "@/lib/utils";

export type SetupState = {
  mode: RoleplayMode;
  scenarioId: string;
  personaId: string;
  difficulty: Difficulty;
  channel: "text" | "voice";
};

type Props = {
  value: SetupState;
  onChange: (next: SetupState) => void;
  onStart: () => void;
  voiceAvailable: boolean;
};

const difficulties: { id: Difficulty; label: string; note: string }[] = [
  { id: "warm", label: "Warm", note: "Curious, open — forgiving of weak turns." },
  {
    id: "neutral",
    label: "Neutral",
    note: "Professional, time-pressed. Fair but busy.",
  },
  {
    id: "skeptical",
    label: "Skeptical",
    note: "Guarded, interrupts fast. Tests every claim.",
  },
];

export function SetupPanel({ value, onChange, onStart, voiceAvailable }: Props) {
  const activeScenario =
    scenarios.find((s) => s.id === value.scenarioId) ?? scenarios[0]!;
  const activePersona =
    personas.find((p) => p.id === value.personaId) ?? personas[0]!;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      {/* Mode */}
      <Section
        title="1. Who are you playing?"
        subtitle="The AI takes the other side of the table."
      >
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
          <ModeCard
            active={value.mode === "user_is_rep"}
            onClick={() =>
              onChange({ ...value, mode: "user_is_rep" })
            }
            title="I'm the Ladder rep"
            subtitle="Practice selling. AI plays the roofing-company buyer."
            icon={Briefcase}
          />
          <ModeCard
            active={value.mode === "user_is_buyer"}
            onClick={() =>
              onChange({ ...value, mode: "user_is_buyer" })
            }
            title="I'm the buyer"
            subtitle="Listen to what great sounds like. AI plays a Ladder AE."
            icon={GraduationCap}
          />
        </div>
      </Section>

      {/* Scenario */}
      <Section
        title="2. Pick a scenario"
        subtitle="Each scenario maps to a LADDER stage and has its own coaching rubric."
      >
        <div className="grid grid-cols-1 gap-2 tablet:grid-cols-2">
          {scenarios.map((s) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              active={value.scenarioId === s.id}
              onClick={() => onChange({ ...value, scenarioId: s.id })}
            />
          ))}
        </div>
      </Section>

      {/* Persona */}
      <Section
        title="3. Who's on the other side?"
        subtitle={
          value.mode === "user_is_rep"
            ? "The AI will play this buyer."
            : "The AI-rep will be calling into this buyer."
        }
      >
        <div className="grid grid-cols-1 gap-2 tablet:grid-cols-2">
          {personas.map((p) => (
            <PersonaCard
              key={p.id}
              persona={p}
              active={value.personaId === p.id}
              onClick={() => onChange({ ...value, personaId: p.id })}
            />
          ))}
        </div>
      </Section>

      {/* Difficulty */}
      <Section title="4. Difficulty" subtitle="How much grace does the buyer give you?">
        <div className="grid grid-cols-1 gap-2 tablet:grid-cols-3">
          {difficulties.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onChange({ ...value, difficulty: d.id })}
              className={cn(
                "flex flex-col gap-1 rounded-md border p-3 text-left transition-colors",
                value.difficulty === d.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
              )}
              aria-pressed={value.difficulty === d.id}
            >
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
                {d.label}
              </span>
              <span className="text-xs text-muted-foreground">{d.note}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Channel */}
      <Section title="5. Channel" subtitle="Text chat for iteration. Voice call for realism.">
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
          <ChannelCard
            active={value.channel === "text"}
            onClick={() => onChange({ ...value, channel: "text" })}
            title="Text chat"
            subtitle="Streaming chat. Type turns. Pause anytime."
            icon={MessageSquare}
          />
          <ChannelCard
            active={value.channel === "voice"}
            disabled={!voiceAvailable}
            onClick={() => {
              if (!voiceAvailable) return;
              onChange({ ...value, channel: "voice" });
            }}
            title="Live voice call"
            subtitle={
              voiceAvailable
                ? "Real call simulation via Hume EVI — empathic voice with prosody."
                : "Set HUME_API_KEY, HUME_SECRET, and HUME_CONFIG to enable."
            }
            icon={voiceAvailable ? PhoneIncoming : Headphones}
          />
        </div>
      </Section>

      {/* Summary + start */}
      <div className="flex flex-col gap-3 rounded-md border border-primary/30 bg-primary/5 p-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex flex-col gap-1">
          <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
            Ready to run
          </div>
          <div className="text-sm text-foreground">
            <strong>{activeScenario.name}</strong> — you play the{" "}
            <strong>{value.mode === "user_is_rep" ? "rep" : "buyer"}</strong> against{" "}
            <strong>
              {activePersona.name}, {activePersona.title}
            </strong>{" "}
            · {value.difficulty} · {value.channel === "text" ? "text" : "voice"}
          </div>
        </div>
        <Button onClick={onStart} size="lg" className="gap-2">
          <Zap className="h-4 w-4" />
          Start session
        </Button>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  // Split a leading "1. " step number from the rest of the title so the
  // step number can be rendered as a contrast pill, the way other
  // "configurable" surfaces highlight that something is selectable.
  const stepMatch = /^(\d+)\.\s+(.*)$/.exec(title);
  const stepNumber = stepMatch?.[1];
  const stepTitle = stepMatch?.[2] ?? title;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          {stepNumber ? (
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-hot/40 bg-hot/10 px-1.5 font-mono text-[11px] font-bold text-hot">
              {stepNumber}
            </span>
          ) : null}
          <h2 className="font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-hot">
            {stepTitle}
          </h2>
        </div>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function ModeCard({
  active,
  onClick,
  title,
  subtitle,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-md border p-4 text-left transition-colors",
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </button>
  );
}

function ChannelCard(props: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  const { active, onClick, title, subtitle, icon: Icon, disabled } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "flex items-start gap-3 rounded-md border p-4 text-left transition-colors",
        disabled
          ? "cursor-not-allowed border-border bg-muted/30 opacity-60"
          : active
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
          active && !disabled
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
    </button>
  );
}

function ScenarioCard({
  scenario,
  active,
  onClick,
}: {
  scenario: Scenario;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-2 rounded-md border p-3 text-left transition-colors",
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold">{scenario.name}</div>
        <Badge variant="muted" className="shrink-0 font-mono text-[10px]">
          {scenario.stageLetter}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">{scenario.short}</div>
    </button>
  );
}

function PersonaCard({
  persona,
  active,
  onClick,
}: {
  persona: Persona;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-1 rounded-md border p-3 text-left transition-colors",
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold">{persona.name}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {persona.title}
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground">{persona.company}</div>
      <div className="mt-1 text-xs text-foreground/80">{persona.bio}</div>
    </button>
  );
}

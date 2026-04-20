export type SequenceChannel = "email" | "linkedin";

export type SequenceTouchType =
  | "signal-hook"
  | "connection-request"
  | "insight-add"
  | "conversational"
  | "different-angle"
  | "break-up";

export type SequenceTouch = {
  number: 1 | 2 | 3 | 4 | 5 | 6;
  day: number;
  channel: SequenceChannel;
  type: SequenceTouchType;
  label: string;
  /** Empty string for LinkedIn touches. */
  subject: string;
  body: string;
  wordCount: number;
  /** One-line strategic note describing what this touch is doing. */
  intent: string;
};

export type EmailSequence = {
  touches: SequenceTouch[];
};

export type SequenceInputs = {
  icp: string;
  triggerSignal: string;
  problemStatement: string;
  outcome: string;
  prospectName: string;
  prospectTitle: string;
  company: string;
  senderName: string;
  senderCompany: string;
  ctaPreference: string;
  tone: "direct" | "warm" | "analytical";
};

export const DEFAULT_SEQUENCE_INPUTS: SequenceInputs = {
  icp: "VP of Sales at 50-200 person B2B SaaS companies that just raised Series B",
  triggerSignal:
    "Posted 4 SDR job openings in the last 14 days on LinkedIn and company careers page",
  problemStatement:
    "SDR teams scaling past 10 reps consistently see ramp time blow past 90 days, costing a full quarter of quota production",
  outcome:
    "Cut SDR ramp time from 90 days to 45 without adding enablement headcount",
  prospectName: "Sarah Chen",
  prospectTitle: "VP of Sales",
  company: "Northwind",
  senderName: "Alex Rivera",
  senderCompany: "Ascend",
  ctaPreference: "15-minute call Thursday or Friday",
  tone: "direct",
};

export const TOUCH_META: Record<
  SequenceTouchType,
  { label: string; channel: SequenceChannel; day: number; number: 1 | 2 | 3 | 4 | 5 | 6 }
> = {
  "signal-hook": { label: "Signal Hook", channel: "email", day: 1, number: 1 },
  "connection-request": {
    label: "LinkedIn Connection",
    channel: "linkedin",
    day: 3,
    number: 2,
  },
  "insight-add": { label: "Insight Add", channel: "email", day: 5, number: 3 },
  conversational: {
    label: "LinkedIn Message",
    channel: "linkedin",
    day: 8,
    number: 4,
  },
  "different-angle": {
    label: "Different Angle",
    channel: "email",
    day: 12,
    number: 5,
  },
  "break-up": { label: "Break-Up Email", channel: "email", day: 16, number: 6 },
};

export const SEQUENCE_ORDER: SequenceTouchType[] = [
  "signal-hook",
  "connection-request",
  "insight-add",
  "conversational",
  "different-angle",
  "break-up",
];

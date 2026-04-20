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

/**
 * Defaults wired to Ladder's actual ICP: mid-size roofing companies
 * with rep churn and an active canvass motion. SmartHire angle by default.
 */
export const DEFAULT_SEQUENCE_INPUTS: SequenceInputs = {
  icp: "VP of Sales / Sales Director at mid-size US roofing companies (25-200 employees, $5M-$50M revenue) running a canvass motion on Spotio or SalesRabbit",
  triggerSignal:
    "4+ active canvasser or sales rep postings on Indeed in the last 30 days, plus 5+ rep departures visible on LinkedIn in the last 6 months",
  problemStatement:
    "60% of roofing sales hires quit in 90 days and each washout burns ~$11K in recruiting, onboarding, and ramp salary — and it compounds every quarter",
  outcome:
    "Cut 90-day washout rate from 58% to 27% in the first quarter without adding recruiting headcount",
  prospectName: "Derek Hollis",
  prospectTitle: "VP of Sales",
  company: "Crestline Roofing",
  senderName: "Alex Rivera",
  senderCompany: "Ladder",
  ctaPreference: "20-minute Ladder Fit Call Thursday or Friday",
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

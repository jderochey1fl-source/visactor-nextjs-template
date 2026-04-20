export type FollowUpType = "recap" | "value-add" | "re-engagement";

export type FollowUpEmail = {
  type: FollowUpType;
  /** Number of days after the meeting this email should be sent. */
  sendAfterDays: number;
  label: string;
  subject: string;
  body: string;
  wordCount: number;
  /** One-sentence strategic intent for this email. */
  intent: string;
  /**
   * Optional 2-3 concrete resource ideas (used by value-add type).
   * Each string is a short title/description the rep can research and attach.
   */
  resourceIdeas?: string[];
};

export type FollowUpBundle = {
  emails: FollowUpEmail[];
};

export type FollowUpInputs = {
  prospectName: string;
  prospectTitle: string;
  company: string;
  meetingType: "discovery" | "demo" | "stakeholder-review" | "check-in";
  meetingDate: string;
  /** Free-text notes - things the prospect actually said, in their words. */
  meetingNotes: string;
  /** Specific challenges or priorities they mentioned. */
  challenges: string;
  /** The agreed next step with a date. */
  nextStep: string;
  senderName: string;
  senderCompany: string;
  tone: "direct" | "warm" | "analytical";
};

/**
 * Defaults grounded in a realistic Ladder discovery call with a
 * roofing-company VP of Sales — washout pain + canvass waste.
 */
export const DEFAULT_FOLLOW_UP_INPUTS: FollowUpInputs = {
  prospectName: "Derek Hollis",
  prospectTitle: "VP of Sales",
  company: "Crestline Roofing",
  meetingType: "discovery",
  meetingDate: "today",
  meetingNotes:
    "Hired 12 sales reps in 2025 — 7 quit inside 90 days, so the real hire count was 5. Canvassers are knocking ~175 doors per close, which Derek thinks should be under 100. Owner is asking for a plan before Q2 storm season. Runs Spotio + JobNimbus. Hiring spend was ~$110K last year against $44K of actual retained reps.",
  challenges:
    "90-day sales-rep washout burning recruiting budget every quarter; canvassers wasting ~60% of each day on dead zones; pressure from Owner to fix both before May",
  nextStep:
    "Send Ladder ROI calculator pre-populated with Crestline's 2025 hire count and canvass volume; schedule 30-min stakeholder review Tuesday at 2pm CT with Derek + GM",
  senderName: "Alex Rivera",
  senderCompany: "Ladder",
  tone: "direct",
};

export const FOLLOW_UP_META: Record<
  FollowUpType,
  {
    label: string;
    sendAfterDays: number;
    wordTarget: { min: number; max: number };
    description: string;
  }
> = {
  recap: {
    label: "Recap Email",
    sendAfterDays: 0,
    wordTarget: { min: 60, max: 100 },
    description:
      "Send within 2 hours. A document of shared understanding, not a summary.",
  },
  "value-add": {
    label: "Value-Add Follow-Up",
    sendAfterDays: 4,
    wordTarget: { min: 60, max: 120 },
    description:
      "Send 3-5 days later if no reply. Share something genuinely useful. No pitch.",
  },
  "re-engagement": {
    label: "Re-Engagement",
    sendAfterDays: 14,
    wordTarget: { min: 40, max: 90 },
    description:
      "Send 14 days after last contact. Specific reference, acknowledge time, low-friction ask.",
  },
};

export const FOLLOW_UP_ORDER: FollowUpType[] = [
  "recap",
  "value-add",
  "re-engagement",
];

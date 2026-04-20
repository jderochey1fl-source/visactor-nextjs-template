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

export const DEFAULT_FOLLOW_UP_INPUTS: FollowUpInputs = {
  prospectName: "Sarah Chen",
  prospectTitle: "VP of Sales",
  company: "Northwind",
  meetingType: "discovery",
  meetingDate: "today",
  meetingNotes:
    "Scaling from 8 to 20 SDRs by Q3. New hires are taking 4+ months to hit quota. Current enablement is a Google Doc her team maintains on the side. Board is asking about pipeline coverage for the H2 plan.",
  challenges:
    "SDR ramp time, inconsistent messaging across new hires, enablement team has no bandwidth to build a real program",
  nextStep:
    "Send a Loom walkthrough of the onboarding module by Friday, regroup on a 30-min call Tuesday at 2pm CT",
  senderName: "Alex Rivera",
  senderCompany: "Ascend",
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

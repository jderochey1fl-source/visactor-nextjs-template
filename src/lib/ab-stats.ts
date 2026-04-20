// Two-proportion z-test utilities for A/B testing email campaigns.
// All functions are pure and return numbers / labels — no side effects.

export type VariantCounts = {
  sends: number;
  opens: number;
  replies: number;
  meetings: number;
};

export type VariantRates = {
  openRate: number;
  replyRate: number;
  meetingRate: number;
};

export function rates(v: VariantCounts): VariantRates {
  return {
    openRate: v.sends > 0 ? v.opens / v.sends : 0,
    replyRate: v.sends > 0 ? v.replies / v.sends : 0,
    meetingRate: v.sends > 0 ? v.meetings / v.sends : 0,
  };
}

// Abramowitz & Stegun 26.2.17 — approx normal CDF, no deps.
function normalCdf(z: number): number {
  const p = 0.2316419;
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const t = 1 / (1 + p * Math.abs(z));
  const poly = b1 * t + b2 * t * t + b3 * t ** 3 + b4 * t ** 4 + b5 * t ** 5;
  const pdf = Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
  const cdf = 1 - pdf * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

export type SignificanceResult = {
  zScore: number;
  pValue: number;
  isSignificant: boolean;
  confidence: number; // e.g. 0.95
  lift: number; // rateB - rateA
  relativeLift: number; // (rateB - rateA) / rateA
  winner: "A" | "B" | "tie";
};

export function twoProportionTest(
  successA: number,
  nA: number,
  successB: number,
  nB: number,
): SignificanceResult {
  const pA = nA > 0 ? successA / nA : 0;
  const pB = nB > 0 ? successB / nB : 0;
  const pooled = nA + nB > 0 ? (successA + successB) / (nA + nB) : 0;
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / nA + 1 / nB));
  const z = se > 0 ? (pB - pA) / se : 0;
  // two-tailed
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  const lift = pB - pA;
  const relativeLift = pA > 0 ? (pB - pA) / pA : 0;
  let winner: "A" | "B" | "tie" = "tie";
  if (p < 0.05 && lift !== 0) winner = lift > 0 ? "B" : "A";
  return {
    zScore: z,
    pValue: p,
    isSignificant: p < 0.05,
    confidence: 1 - p,
    lift,
    relativeLift,
    winner,
  };
}

export type SampleStatus =
  | "insufficient" // < 100 per variant
  | "directional" // 100-199 per variant
  | "reliable"; // 200+ per variant

export function sampleStatus(nA: number, nB: number): SampleStatus {
  const min = Math.min(nA, nB);
  if (min < 100) return "insufficient";
  if (min < 200) return "directional";
  return "reliable";
}

export function pct(n: number, digits = 1): string {
  if (!isFinite(n) || isNaN(n)) return "0%";
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatLift(relative: number): string {
  if (!isFinite(relative) || isNaN(relative) || relative === 0) return "0%";
  const v = relative * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

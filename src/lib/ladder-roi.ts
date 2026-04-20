// Ladder ROI calculators.
// Mirrors the public calculators on https://www.thisisladder.com/roi-calculator.
//
// HIRING WASTE — Ladder's calibration point (from the site):
//   5 reps/mo + 3 canvassers/mo  =>  $106,575 / mo wasted
//   => waste per rep hire     = $15,000
//   => waste per canvasser    = $10,525
//   Annual = monthly * 12
//   LADDER reduces by 20-48%. 20% = $21,315/mo. 48% = $51,156/mo.
//
// TERRITORY WASTE — tunable model:
//   monthlyWaste = canvassers * knocksPerDay * workingDays * (deadZonePct/100) * costPerKnock
//   Same 20-48% savings band from Ladder.

import type {
  HiringRoiInputs,
  RoiAttachment,
  TerritoryRoiInputs,
} from "@/types/types";

export const LADDER_SAVINGS_MIN = 0.2;
export const LADDER_SAVINGS_MAX = 0.48;

export const WASTE_PER_REP_HIRE = 15000;
export const WASTE_PER_CANVASSER_HIRE = 10525;

export const HIRING_DEFAULTS: HiringRoiInputs = {
  salesRepsPerMonth: 5,
  canvassersPerMonth: 3,
};

export const TERRITORY_DEFAULTS: TerritoryRoiInputs = {
  canvassers: 5,
  knocksPerCanvasserPerDay: 80,
  workingDaysPerMonth: 22,
  deadZonePct: 35,
  costPerKnock: 6,
};

export function computeHiringRoi(
  inputs: HiringRoiInputs,
): RoiAttachment & { kind: "hiring-waste" } {
  const reps = Math.max(0, inputs.salesRepsPerMonth);
  const cans = Math.max(0, inputs.canvassersPerMonth);
  const monthlyWaste =
    reps * WASTE_PER_REP_HIRE + cans * WASTE_PER_CANVASSER_HIRE;
  const annualWaste = monthlyWaste * 12;
  const savingsMin = Math.round(monthlyWaste * LADDER_SAVINGS_MIN);
  const savingsMax = Math.round(monthlyWaste * LADDER_SAVINGS_MAX);
  return {
    kind: "hiring-waste",
    inputs: { salesRepsPerMonth: reps, canvassersPerMonth: cans },
    monthlyWaste,
    annualWaste,
    savingsMin,
    savingsMax,
    sentence: hiringSentence(
      reps,
      cans,
      monthlyWaste,
      annualWaste,
      savingsMin,
      savingsMax,
    ),
  };
}

export function computeTerritoryRoi(
  inputs: TerritoryRoiInputs,
): RoiAttachment & { kind: "territory-waste" } {
  const c = Math.max(0, inputs.canvassers);
  const k = Math.max(0, inputs.knocksPerCanvasserPerDay);
  const d = Math.max(0, inputs.workingDaysPerMonth);
  const deadPct = Math.max(0, Math.min(100, inputs.deadZonePct));
  const costPerKnock = Math.max(0, inputs.costPerKnock);
  const monthlyWaste = Math.round(
    c * k * d * (deadPct / 100) * costPerKnock,
  );
  const annualWaste = monthlyWaste * 12;
  const savingsMin = Math.round(monthlyWaste * LADDER_SAVINGS_MIN);
  const savingsMax = Math.round(monthlyWaste * LADDER_SAVINGS_MAX);
  return {
    kind: "territory-waste",
    inputs: {
      canvassers: c,
      knocksPerCanvasserPerDay: k,
      workingDaysPerMonth: d,
      deadZonePct: deadPct,
      costPerKnock,
    },
    monthlyWaste,
    annualWaste,
    savingsMin,
    savingsMax,
    sentence: territorySentence(
      c,
      k,
      d,
      deadPct,
      monthlyWaste,
      annualWaste,
      savingsMin,
      savingsMax,
    ),
  };
}

export function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function hiringSentence(
  reps: number,
  cans: number,
  monthlyWaste: number,
  annualWaste: number,
  savingsMin: number,
  savingsMax: number,
): string {
  const parts: string[] = [];
  if (reps > 0) parts.push(`${reps} sales rep${reps === 1 ? "" : "s"}`);
  if (cans > 0)
    parts.push(`${cans} canvasser${cans === 1 ? "" : "s"}`);
  const hireLine =
    parts.length > 0 ? `At ${parts.join(" and ")} a month, ` : "";
  return `${hireLine}the washout math says you're losing ${formatMoney(monthlyWaste)}/month — ${formatMoney(annualWaste)}/year. Cutting that by our proven 20-48% range puts ${formatMoney(savingsMin)} to ${formatMoney(savingsMax)}/month back in your pocket, and SmartHire starts at $499. One saved washout pays for the year.`;
}

function territorySentence(
  canvassers: number,
  knocks: number,
  days: number,
  deadPct: number,
  monthlyWaste: number,
  annualWaste: number,
  savingsMin: number,
  savingsMax: number,
): string {
  return `With ${canvassers} canvasser${canvassers === 1 ? "" : "s"} knocking ${knocks}/day across ${days} working days, if ~${Math.round(deadPct)}% land in dead zones you're burning ${formatMoney(monthlyWaste)}/month — ${formatMoney(annualWaste)}/year in labor and truck time. SmartTerritory recovers 20-48% of that (${formatMoney(savingsMin)}-${formatMoney(savingsMax)}/month) by pointing crews at the blocks that actually convert.`;
}

export function roiLabel(kind: RoiAttachment["kind"]): string {
  return kind === "hiring-waste" ? "Hiring Waste" : "Territory Waste";
}

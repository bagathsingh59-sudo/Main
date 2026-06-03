import type { CalculatorInput, CalculatorOutput } from "@/types";

/**
 * Heuristic estimator used by the on-page Compliance Calculator.
 * Numbers are deliberately conservative so estimates skew lower than the
 * actual quoted price — improves trust.
 */
export function estimateCompliance(input: CalculatorInput): CalculatorOutput {
  const { employees, hasGst, hasPf, hasEsi, industry } = input;

  // Base payroll cost: ₹49 per employee per month, floored at ₹5,000
  let monthlyCost = Math.max(5000, employees * 49);

  if (hasPf) monthlyCost += 7500;
  if (hasEsi) monthlyCost += 4500;
  if (hasGst) monthlyCost += 12500;

  // Industry uplift
  const uplift: Record<string, number> = {
    saas: 1.05,
    manufacturing: 1.12,
    healthcare: 1.1,
    ecommerce: 1.15,
    bfsi: 1.25,
  };
  monthlyCost *= uplift[industry] ?? 1.0;

  // Hours saved per month (HR / finance combined)
  const savedHours = Math.round(employees * 0.6 + (hasGst ? 32 : 0) + (hasPf ? 14 : 0));

  // Risk score (0 = perfectly compliant, 100 = high risk) — assumes pre-onboarding state
  const baseRisk = 70 - Math.min(40, employees / 15);
  const riskScore = Math.round(
    Math.max(8, baseRisk - (hasGst ? 10 : 0) - (hasPf ? 8 : 0) - (hasEsi ? 6 : 0)),
  );

  const recommendedServices: string[] = [];
  if (employees > 0) recommendedServices.push("Payroll Management");
  if (hasPf || hasEsi) recommendedServices.push("EPF & ESI Compliance");
  if (hasGst) recommendedServices.push("GST Compliance");
  if (employees > 50) recommendedServices.push("Labour Law Compliance");
  if (employees > 100) recommendedServices.push("Virtual CFO Advisory");

  return {
    monthlyCost: Math.round(monthlyCost / 100) * 100,
    savedHours,
    riskScore,
    recommendedServices,
  };
}

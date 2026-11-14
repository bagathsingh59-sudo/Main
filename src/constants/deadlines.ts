/**
 * Recurring monthly statutory due dates shown in the hero ticker.
 *
 * PLACEHOLDER DATA — the usual due day for a monthly filer. Verify each
 * one (and any state-specific or quarterly variations) before launch.
 */
export interface MonthlyDeadline {
  label: string;
  /** Day of the month the filing or payment is due. */
  day: number;
}

export const MONTHLY_DEADLINES: readonly MonthlyDeadline[] = [
  { label: "TDS payment", day: 7 },
  { label: "GSTR-1", day: 11 },
  { label: "PF ECR", day: 15 },
  { label: "ESI contribution", day: 15 },
  { label: "GSTR-3B", day: 20 },
  { label: "Professional Tax", day: 20 },
];

/** Office hours used by the hero's live status chip (India Standard Time). */
export const OFFICE_HOURS = {
  /** 0 = Sunday … 6 = Saturday */
  openDays: [1, 2, 3, 4, 5, 6],
  opensAt: 9 * 60 + 30,
  closesAt: 19 * 60,
  opensLabel: "9:30 AM",
} as const;

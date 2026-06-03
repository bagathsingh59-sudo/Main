import { type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "teal" | "neutral" | "dark";
  dot?: boolean;
}

const tones = {
  brand: "bg-white/55 border-white/75 text-navy-600",
  teal: "bg-teal-50 border-teal-100 text-teal-700",
  neutral: "bg-navy-50 border-navy-100/60 text-navy-700",
  dark: "bg-white/10 border-white/20 text-white",
} as const;

export function Badge({ children, className, tone = "brand", dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border backdrop-blur-md px-4 py-1.5 text-[0.78rem] font-semibold tracking-wide shadow-soft",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-500">
        <span className="absolute inset-0 inline-flex h-full w-full animate-pulse-soft rounded-full bg-teal-500/70" />
      </span>}
      {children}
    </span>
  );
}

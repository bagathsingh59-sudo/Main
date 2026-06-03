import Link from "next/link";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  tone?: "light" | "dark";
  withWordmark?: boolean;
}

export function Logo({ className, tone = "light", withWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Vaishnavi Consultants — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand shadow-glow",
          "transition-transform duration-300 group-hover:scale-105",
        )}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <path d="M4 4 12 2l8 2v7c0 5-3.5 8.6-8 10-4.5-1.4-8-5-8-10V4Z" strokeLinejoin="round" />
          <path d="m8.5 12 2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {withWordmark && (
        <span
          className={cn(
            "font-display text-[1.1rem] leading-none tracking-tight",
            tone === "light" ? "text-navy-900" : "text-white",
          )}
        >
          Vaishnavi<span className="text-teal-600">.</span>
        </span>
      )}
    </Link>
  );
}

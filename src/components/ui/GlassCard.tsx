import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: "light" | "dark";
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { children, className, tone = "light", hover = true, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border backdrop-blur-xl shadow-soft transition-all duration-300",
        tone === "light"
          ? "bg-white/55 border-white/70 text-navy-900"
          : "bg-white/[0.06] border-white/[0.12] text-white",
        hover && "hover:-translate-y-1 hover:shadow-elevated",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

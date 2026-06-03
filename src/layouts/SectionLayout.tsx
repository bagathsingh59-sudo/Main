import { type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";

interface SectionLayoutProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  bleed?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "light" | "dark";
  /** Vertical padding scale */
  spacing?: "sm" | "md" | "lg";
  "aria-labelledby"?: string;
}

const spacings = {
  sm: "py-16 sm:py-20",
  md: "py-20 sm:py-28",
  lg: "py-24 sm:py-32",
} as const;

export function SectionLayout({
  id,
  children,
  className,
  containerClassName,
  bleed,
  size = "lg",
  tone = "light",
  spacing = "md",
  ...rest
}: SectionLayoutProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        spacings[spacing],
        tone === "dark" && "text-white",
        className,
      )}
      {...rest}
    >
      {bleed ? children : <Container size={size} className={containerClassName}>{children}</Container>}
    </section>
  );
}

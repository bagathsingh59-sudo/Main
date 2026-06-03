import { type ReactNode, type ElementType } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
} as const;

export function Container({ as: Tag = "div", className, children, size = "lg" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5 sm:px-8", sizes[size], className)}>{children}</Tag>;
}

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

/**
 * Orisa pill button (`.at-btn`) — the label rolls up on hover and an
 * identical copy rolls in from below.
 */
interface AtButtonProps {
  href: string;
  children: string;
  size?: "md" | "sm";
  className?: string;
  /** Optional trailing icon (rendered once; not part of the roll). */
  icon?: ReactNode;
}

export function AtButton({ href, children, size = "md", className, icon }: AtButtonProps) {
  const external = /^https?:\/\//.test(href);
  const inner = (
    <>
      <span>
        <span className="text-1">{children}</span>
        <span className="text-2" aria-hidden="true">
          {children}
        </span>
      </span>
      {icon}
    </>
  );
  const classes = cn("at-btn", size === "sm" && "btn-sm", className);
  return external ? (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

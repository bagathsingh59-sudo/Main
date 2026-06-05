import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  /** Visual context — drives whether a soft backdrop is added so the navy ink stays legible. */
  tone?: "light" | "dark";
  /** Show the "Vaishnavi." wordmark next to the mark. */
  withWordmark?: boolean;
  /** Visual size of the mark in px (height). Defaults to 38. */
  size?: number;
  /** Admin-uploaded logo URL. Falls back to the bundled brand asset. */
  overrideSrc?: string;
}

/**
 * Brand logo — renders the user-supplied transparent PNG from
 * /public/brand/logo.png (produced by scripts/process-logo.mjs).
 *
 * On dark surfaces a soft white pill is added behind the mark so the navy
 * elements of the logo do not blend into the background.
 */
export function Logo({
  className,
  tone = "light",
  withWordmark = true,
  size = 38,
  overrideSrc,
}: LogoProps) {
  const isDark = tone === "dark";
  const src = overrideSrc && overrideSrc.trim().length > 0 ? overrideSrc : "/brand/logo.png";
  const isExternal = src.startsWith("http");

  return (
    <Link
      href="/"
      aria-label="Vaishnavi Consultants — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "relative flex flex-shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105",
          isDark && "rounded-lg bg-white/95 p-1 shadow-soft",
        )}
        style={{ width: size, height: size }}
      >
        {isExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-auto object-contain" />
        ) : (
          <Image
            src={src}
            alt=""
            width={size * 2}
            height={size * 2}
            priority
            className="h-full w-auto object-contain"
          />
        )}
      </span>
      {withWordmark && (
        <span
          className={cn(
            "font-display text-[1.1rem] leading-none tracking-tight",
            isDark ? "text-white" : "text-navy-900",
          )}
        >
          Vaishnavi<span className="text-teal-600">.</span>
        </span>
      )}
    </Link>
  );
}

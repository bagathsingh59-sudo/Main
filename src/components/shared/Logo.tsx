import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  tone?: "light" | "dark";
  withWordmark?: boolean;
  /** Visual size of the mark in px (height). Defaults to 36. */
  size?: number;
}

/**
 * Brand logo — uses the supplied raster mark from /public/brand/logo.png
 * (extracted from the original Logo-svg.svg the user provided). Falls back
 * to the inline VC monogram if the image is unavailable.
 */
export function Logo({ className, tone = "light", withWordmark = true, size = 36 }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Vaishnavi Consultants — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className="relative flex flex-shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo.png"
          alt=""
          width={size * 2}
          height={size * 2}
          priority
          className="h-full w-auto object-contain"
        />
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

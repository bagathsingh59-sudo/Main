import { type SVGProps } from "react";
import type { IconName } from "@/types";

/**
 * Tiny inline SVG icon set — keeps the bundle lean and removes the lucide dep at runtime.
 * Each path uses currentColor so colour is driven by Tailwind text utilities.
 */
const paths: Record<IconName, string> = {
  Wallet:
    "M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Zm0 0V6a2 2 0 0 1 2-2h11M17 13h2",
  ShieldCheck: "M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Zm-3.5 9 2.5 2.5 5-5",
  Scale: "M12 3v18M5 7h14M7 7l-3 8a4 4 0 0 0 8 0L9 7m6 0-3 8a4 4 0 0 0 8 0l-3-8",
  Receipt: "M5 3h14v18l-3-2-3 2-3-2-3 2-2-2V3Zm3 5h8M8 12h8M8 16h5",
  FileText: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Zm0 0v6h6M9 13h6M9 17h6M9 9h1",
  LineChart: "M3 3v18h18M7 14l4-4 4 3 5-7",
  ClipboardCheck:
    "M9 4h6a1 1 0 0 1 1 1v2H8V5a1 1 0 0 1 1-1Zm-3 3h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm3 9 2 2 4-4",
  Building2: "M3 21h18M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M15 9h4a2 2 0 0 1 2 2v10M9 7h2M9 11h2M9 15h2",
  Users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  Activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  Lock: "M5 11V8a7 7 0 0 1 14 0v3m-12 0h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z",
  Globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9ZM3 12h18",
  Clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
  Sparkles: "M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.5 2.5M16 16l2.5 2.5M5.5 18.5 8 16M16 8l2.5-2.5",
  Calculator: "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 4h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2",
  Award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3 0-2 6 5-3 5 3-2-6",
  BookOpen: "M2 5h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H2V5Zm20 0h-7a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h7V5Z",
  Bell: "M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Zm4 13a2 2 0 0 0 4 0",
  Mail: "M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  Phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
  MapPin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Zm-9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 22, strokeWidth = 1.75, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}

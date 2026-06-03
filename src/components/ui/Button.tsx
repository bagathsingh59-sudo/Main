import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "ghost" | "outline" | "white" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-600";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[0_6px_24px_rgba(26,86,219,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,86,219,0.5)]",
  ghost:
    "bg-white/55 text-navy-900 border border-white/70 backdrop-blur-md hover:bg-white/85 hover:-translate-y-0.5",
  outline:
    "bg-transparent text-navy-900 border-2 border-navy-900/15 hover:border-navy-600 hover:text-navy-600",
  white:
    "bg-white text-navy-600 shadow-elevated hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.28)]",
  dark:
    "bg-navy-900 text-white hover:bg-navy-800 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.82rem]",
  md: "h-11 px-6 text-[0.92rem]",
  lg: "h-14 px-8 text-[0.95rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonAsButton | ButtonAsLink>(
  function Button(props, ref) {
    const { variant = "primary", size = "md", className, children, leftIcon, rightIcon, ...rest } = props;
    const classes = cn(base, variants[variant], sizes[size], className);

    if ("href" in rest && rest.href) {
      const { href, ...anchorProps } = rest as ButtonAsLink;
      const isExternal = /^https?:\/\//.test(href);
      const inner = (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      );
      if (isExternal) {
        return (
          <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorProps}>
            {inner}
          </a>
        );
      }
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorProps}>
          {inner}
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...(rest as ButtonAsButton)}>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </button>
    );
  },
);

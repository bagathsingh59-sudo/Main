"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/constants/nav";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { cn } from "@/utils/cn";

interface NavbarProps {
  /** Admin-editable nav links. Falls back to NAV_LINKS constant. */
  links?: readonly { label: string; href: string; visible?: boolean }[];
  /** Admin-uploaded logo URL. Falls back to bundled brand asset. */
  logoUrl?: string;
}

export function Navbar({ links, logoUrl }: NavbarProps = {}) {
  const source: ReadonlyArray<{ label: string; href: string; visible?: boolean }> =
    links && links.length > 0 ? links : NAV_LINKS;
  const navLinks = source.filter((l) => l.visible !== false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-300",
        scrolled
          ? "bg-mist/85 backdrop-blur-xl border-b border-white/60 shadow-soft"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <Logo overrideSrc={logoUrl} />

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-[0.86rem] font-medium transition-colors",
                  active ? "text-navy-900" : "text-navy-900/70 hover:text-navy-900",
                )}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white/70 shadow-soft"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button href="/contact" size="sm" className="hidden md:inline-flex">
            Book consultation
          </Button>
          <button
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-900/15 bg-white/70 backdrop-blur"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-3.5 w-5">
              <span className={cn("absolute left-0 top-0 h-[2px] w-full rounded bg-navy-900 transition-all", open && "translate-y-[7px] rotate-45")} />
              <span className={cn("absolute left-0 top-[7px] h-[2px] w-full rounded bg-navy-900 transition-all", open && "opacity-0")} />
              <span className={cn("absolute left-0 top-[14px] h-[2px] w-full rounded bg-navy-900 transition-all", open && "-translate-y-[7px] -rotate-45")} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden mx-4 mb-4 rounded-2xl border border-white/70 bg-white/95 backdrop-blur-xl shadow-elevated"
          >
            <ul className="p-3">
              {navLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-[0.95rem] font-medium transition-colors",
                        active ? "bg-navy-50 text-navy-900" : "text-navy-900/80 hover:bg-navy-50",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="p-3">
                <Button href="/contact" className="w-full" onClick={() => setOpen(false)}>
                  Book consultation
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

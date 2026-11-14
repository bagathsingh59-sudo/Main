"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { AtButton } from "./AtButton";
import { ORISA_NAV, ORISA_SEARCH_INDEX, type OrisaNavLink, type OrisaPalette } from "./config";

/**
 * Site header — Orisa `header-14`: meta strip, logo, centred tabs,
 * search / dark-mode / side-panel buttons and the CTA. Once the bar
 * has scrolled away the template's floating MENU pill takes over.
 */
interface OrisaHeaderProps {
  links?: readonly OrisaNavLink[];
  logoUrl?: string;
  /** Left / right text of the thin strip above the bar. */
  meta: { key: string; hours: string; phone: string; note: string };
  contact: { phone: string; email: string; address: string[]; hours: string };
  cta?: { label: string; href: string };
}

const THEME_KEY = "vc-theme";

export function OrisaHeader({
  links = ORISA_NAV,
  logoUrl,
  meta,
  contact,
  cta = { label: "Book consultation", href: "/contact" },
}: OrisaHeaderProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState<"none" | "menu" | "search">("none");
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  /* Theme + palette live on the nearest `.orisa` wrapper. */
  useEffect(() => {
    const shell = rootRef.current?.closest<HTMLElement>(".orisa");
    if (!shell) return;
    const palette = new URLSearchParams(window.location.search).get("palette") as OrisaPalette | null;
    if (palette === "brand" || palette === "orisa") shell.dataset.palette = palette;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch {
      /* private mode */
    }
    if (stored === "dark") {
      shell.dataset.theme = "dark";
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const shell = rootRef.current?.closest<HTMLElement>(".orisa");
    const next = !dark;
    setDark(next);
    if (shell) shell.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* private mode */
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setPanel("none"), [pathname]);

  useEffect(() => {
    if (panel === "none") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel("none");
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (panel === "search") searchRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [panel]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ORISA_SEARCH_INDEX.slice(0, 5);
    return ORISA_SEARCH_INDEX.filter((r) => r.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <header ref={rootRef} className="header-14">
      <div className="header-14__meta">
        <div className="header-14__meta-inner">
          <div className="header-14__meta-group">
            <span className="header-14__meta-key">{meta.key}</span>
            <span className="header-14__meta-val">{meta.hours}</span>
          </div>
          <div className="header-14__meta-group">
            <a className="header-14__meta-val" href={`tel:${meta.phone.replace(/\s/g, "")}`}>
              {meta.phone}
            </a>
            <span className="header-14__meta-quiet">{meta.note}</span>
          </div>
        </div>
      </div>

      <div className="header-14__bar">
        <div className="at-header-logo">
          <Link href="/" aria-label="Vaishnavi Consultant — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="at-header-logo__mark" src={logoUrl || "/brand/logo-128.png"} alt="" width={34} height={34} />
            <span className="at-header-logo__word">Vaishnavi</span>
          </Link>
        </div>

        <nav className="at-main-menu" aria-label="Primary">
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                  {l.label}
                  {l.badge && <span className="at-main-menu__badge">{l.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-14__right">
          <button type="button" className="header-14__icon-btn" aria-label="Search" onClick={() => setPanel("search")}>
            <SearchIcon />
          </button>
          <div className="dark-light-mode">
            <button
              type="button"
              className="toggle"
              aria-pressed={dark}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
            >
              <span className="icon icon--moon">
                <MoonIcon />
              </span>
              <span className="icon icon--sun">
                <SunIcon />
              </span>
            </button>
          </div>
          <button
            type="button"
            className="header-14__icon-btn"
            aria-label="Open menu"
            aria-expanded={panel === "menu"}
            onClick={() => setPanel("menu")}
          >
            <GridIcon />
          </button>
          <AtButton href={cta.href} className="header-14__cta">
            {cta.label}
          </AtButton>
        </div>
      </div>

      <button
        type="button"
        className={cn("hamburger-sticky-menu", scrolled && panel === "none" && "header-sticky")}
        onClick={() => setPanel("menu")}
        tabIndex={scrolled ? 0 : -1}
      >
        <span>MENU</span>
        <GridIcon />
      </button>

      <div className={cn("o-overlay", panel !== "none" && "is-open")} onClick={() => setPanel("none")} aria-hidden="true" />

      {/* Side panel */}
      <aside className={cn("o-panel", panel === "menu" && "is-open")} aria-label="Menu" aria-hidden={panel !== "menu"}>
        <div className="o-panel__head">
          <div className="at-header-logo">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="at-header-logo__mark" src={logoUrl || "/brand/logo-128.png"} alt="" width={34} height={34} />
              <span className="at-header-logo__word">Vaishnavi</span>
            </Link>
          </div>
          <button type="button" className="header-14__icon-btn" aria-label="Close menu" onClick={() => setPanel("none")}>
            <CloseIcon />
          </button>
        </div>
        <nav className="o-panel__nav" aria-label="Menu">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} tabIndex={panel === "menu" ? 0 : -1}>
              <span>
                {l.label}
                {l.badge && <span className="at-main-menu__badge">{l.badge}</span>}
              </span>
              <ArrowIcon />
            </Link>
          ))}
        </nav>
        <div className="o-panel__info">
          <div>
            <div className="o-panel__label">Office</div>
            {contact.address.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div>
            <div className="o-panel__label">Talk to us</div>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            <br />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div>
            <div className="o-panel__label">Hours</div>
            {contact.hours}
          </div>
          <AtButton href={cta.href}>{cta.label}</AtButton>
        </div>
      </aside>

      {/* Search */}
      <div className={cn("o-search", panel === "search" && "is-open")} role="dialog" aria-label="Search" aria-hidden={panel !== "search"}>
        <div className="o-search__inner">
          <input
            ref={searchRef}
            className="o-search__field"
            type="search"
            placeholder="Search the site…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            tabIndex={panel === "search" ? 0 : -1}
          />
          <button type="button" className="header-14__icon-btn o-search__close" aria-label="Close search" onClick={() => setPanel("none")}>
            <CloseIcon />
          </button>
          {results.length > 0 ? (
            <div className="o-search__results">
              {results.map((r) => (
                <Link key={r.href} href={r.href} tabIndex={panel === "search" ? 0 : -1}>
                  <span>{r.label}</span>
                  <span>{r.kind}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="o-search__empty">Nothing matches “{query}”. Try “services” or “contact”.</p>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── icons ─────────────────────────────────────────────────── */
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth={2}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

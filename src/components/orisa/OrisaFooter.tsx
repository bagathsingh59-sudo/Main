import Link from "next/link";
import { MotionSection } from "./MotionSection";
import { FooterSignup, LocalTime } from "./FooterBits";

/**
 * Site footer — Orisa `footer-13`: meta strip, brand + sign-up, link
 * columns, office cards, oversized wordmark and the legal row.
 */
export interface OrisaFooterProps {
  logoUrl?: string;
  meta: { key: string; value: string }[];
  intro: string;
  signupLabel: string;
  email: string;
  columns: { title: string; links: { label: string; href: string }[] }[];
  offices: { name: string; lines: string[]; status: string; open?: boolean }[];
  wordmark: [string, string];
  copyright: string;
  social: { label: string; href: string }[];
  legal: { label: string; href: string }[];
}

export function OrisaFooter({ logoUrl, meta, intro, signupLabel, email, columns, offices, wordmark, copyright, social, legal }: OrisaFooterProps) {
  return (
    <MotionSection className="footer-13" aria-label="Site footer" role="contentinfo">
      <div className="footer-13__meta">
        {meta.map((m, i) => (
          <div key={m.key} className={`footer-13__meta-item${i === 0 ? " footer-13__meta-item--lead" : ""}`} data-fade="bottom" data-delay={(0.1 * (i + 1)).toFixed(1)}>
            {i === 0 && <span className="footer-13__meta-dot" aria-hidden="true" />}
            <span className="footer-13__meta-key">{m.key}</span>
            <span className="footer-13__meta-val">{m.value === "{time}" ? <LocalTime /> : m.value}</span>
          </div>
        ))}
      </div>

      <div className="footer-13__body">
        <div className="footer-13__top">
          <div className="footer-13__brand" data-fade="bottom" data-delay=".1">
            <Link className="footer-13__logo" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl || "/brand/logo-128.png"} alt="" width={34} height={34} />
              <span className="footer-13__logo-text">Vaishnavi</span>
            </Link>
            <p className="footer-13__intro">{intro}</p>
            <FooterSignup label={signupLabel} to={email} />
          </div>

          <nav className="footer-13__cols" aria-label="Footer navigation">
            {columns.map((col, i) => (
              <div key={col.title} className="footer-13__col" data-fade="bottom" data-delay={(0.2 + i * 0.1).toFixed(1)}>
                <p className="footer-13__col-title">{col.title}</p>
                <ul className="footer-13__col-list">
                  {col.links.map((l) => (
                    <li key={l.label}>{/^(mailto|tel|https?):/.test(l.href) ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}</li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <ul className="footer-13__studios">
          {offices.map((o, i) => (
            <li key={o.name} className="footer-13__studio" data-fade="bottom" data-delay={(0.1 + i * 0.2).toFixed(1)}>
              <div className="footer-13__studio-head">
                <span className={`footer-13__studio-dot${o.open ? " footer-13__studio-dot--active" : ""}`} aria-hidden="true" />
                <h3 className="footer-13__studio-name">{o.name}</h3>
              </div>
              <address className="footer-13__studio-addr">
                {o.lines.map((line, n) => (
                  <span key={line}>
                    {n > 0 && <br />}
                    {line}
                  </span>
                ))}
              </address>
              <p className={`footer-13__studio-status${o.open ? " footer-13__studio-status--open" : ""}`}>{o.status}</p>
            </li>
          ))}
        </ul>

        <div className="footer-13__bigbrand">
          <p className="footer-13__bigbrand-text">
            {wordmark[0]}
            <sup>&reg;</sup> {wordmark[1]}
          </p>
        </div>
      </div>

      <div className="footer-13__legal">
        <p className="footer-13__copy">{copyright}</p>
        <ul className="footer-13__social">
          {social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="footer-13__legal-links">
          {legal.map((l) => (
            <li key={l.label}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </MotionSection>
  );
}

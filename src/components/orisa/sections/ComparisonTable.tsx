import Link from "next/link";
import { MotionSection } from "../MotionSection";
import { ArrowUpRight } from "../icons";
import { staticText } from "../text";

/**
 * Side-by-side comparison in the index-13 visual language (label dot,
 * reveal title, hairline rows). Built for "managed service vs software",
 * reusable for any two-to-four column comparison.
 */
export interface ComparisonTableProps {
  label: string;
  title: string;
  description?: string;
  columns: { name: string; tagline: string; cta: { label: string; href: string }; highlight?: boolean }[];
  rows: { feature: string; values: (string | boolean)[] }[];
}

export function ComparisonTable({ label, title, description, columns, rows }: ComparisonTableProps) {
  return (
    <MotionSection className="o-compare" aria-label={label}>
      <div className="o-wrap">
        <header className="o-compare__head">
          <div>
            <div className="o-label" data-fade="left" data-delay=".05">
              <span className="o-label__dot" aria-hidden="true" />
              <span>{label}</span>
            </div>
            <h2 className="o-compare__title" data-reveal {...staticText(title)} />
          </div>
          {description && (
            <p className="o-compare__desc" data-fade="bottom">
              {description}
            </p>
          )}
        </header>

        <div className="o-compare__scroll" data-fade="bottom">
          <table className="o-compare__table" style={{ "--cols": columns.length } as React.CSSProperties}>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Feature</span>
                </th>
                {columns.map((c) => (
                  <th key={c.name} scope="col" data-highlight={c.highlight || undefined}>
                    <span className="o-compare__col-name">{c.name}</span>
                    <span className="o-compare__col-tag">{c.tagline}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature}>
                  <th scope="row">{r.feature}</th>
                  {r.values.map((v, i) => (
                    <td key={i} data-highlight={columns[i]?.highlight || undefined}>
                      {v === true ? <Mark yes /> : v === false ? <Mark /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td />
                {columns.map((c) => (
                  <td key={c.name} data-highlight={c.highlight || undefined}>
                    <Link className="o-compare__cta" href={c.cta.href}>
                      {c.cta.label} <ArrowUpRight size={13} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </MotionSection>
  );
}

function Mark({ yes }: { yes?: boolean }) {
  return (
    <span className={`o-compare__mark${yes ? " is-yes" : ""}`}>
      <span className="sr-only">{yes ? "Yes" : "No"}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {yes ? (
          <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        )}
      </svg>
    </span>
  );
}

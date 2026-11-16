/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `services-details.html` (.sec-1-services-details) by scripts/orisa/port-section.py.
// Template copy and images are kept as placeholders — edit freely.
import Link from "next/link";

export interface SvcDetailHeroProps {
  crumb: string;
  title: string;
  lead: string;
  tags: { label: string; href: string }[];
}

export function SvcDetailHero({
  crumb,
  title,
  lead,
  tags,
}: SvcDetailHeroProps) {
  return (
    <div className="sec-1-services-details overflow-hidden pt-150">
      <div className="container">
        <div className="row g-4 align-items-end">
          <div className="col-lg-5 pt-lg-0 pt-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="icon-arrow-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12.1716 8.77815L8.55964e-06 8.77816L1.47897e-06 6.77817L12.1716 6.77816L6.80761 1.41421L8.22183 3.37371e-08L16 7.77815L8.22181 15.5563L6.80759 14.1421L12.1716 8.77815Z"
                    fill="currentColor"
                  />
                </svg>
              </i>
              <span className="text-uppercase neutral-900 fw-600">
                <span className="text-1">
                  <Link href="/">{" home / "}</Link>
                </span>
                <span className="text-1 neutral-500">{` ${crumb} `}</span>
              </span>
            </div>
            <h1 className="section-title d-flex fw-600 mb-40 text-nowrap">
              {title}
            </h1>
            <div className="at-hero-social style-2 justify-content-start">
              {tags.map((t) => (
                <Link key={t.href + t.label} href={t.href}>
                  {` ${t.label} `}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="10"
                    viewBox="0 0 9 10"
                    fill="none"
                  >
                    <path
                      d="M5.62494 9.99994L0.562517 10L0.5625 8.75003L4.49994 8.74996L4.5 2.39273L2.27828 4.86124L1.48278 3.97739L5.0625 0L8.64225 3.97739L7.84676 4.86124L5.625 2.3927L5.62494 9.99994Z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
          <div className="col-lg-5 ms-auto">
            <h2 className="h6 fw-600 mb-0">{lead}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

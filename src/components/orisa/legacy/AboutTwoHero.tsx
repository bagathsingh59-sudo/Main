/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `about-2.html` (.sec-1-about) by scripts/orisa/port-section.py.
// The LinkedIn link comes from Admin → Footer → social links.
import { INDUSTRIES } from "@/constants/industries";

/** Sectors we serve (previous site's "Industries we serve"). */
export const ABOUT_SECTORS = INDUSTRIES.map((i) => ({ label: i.name }));

export function AboutTwoHero({
  linkedinUrl = "https://www.linkedin.com/company/vaishnavi-consultant",
  brands = ABOUT_SECTORS,
}: {
  linkedinUrl?: string;
  brands?: { label: string; logo?: string }[];
}) {
  return (
    <div className="sec-1-about pt-150 border-bottom-100 overflow-hidden">
      <div className="container">
        <div className="row g-4 align-items-end">
          <div className="col-xxl-9 col-lg-8">
            <h1 className="section-title d-flex fw-600 lh-1 fz-200 mb-0" data-reveal="">
              Vaishnavi Consultant
            </h1>
          </div>
          <div className="col-xxl-3 col-lg-4 ms-auto">
            <ul className="at-social-list list-unstyled d-flex flex-wrap align-items-end gap-md-4 gap-3 pb-4">
              <li>
                <a className="at-social__link d-flex align-items-center gap-2" href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M15.3352 15.339H12.6697V11.1622C12.6697 10.1662 12.6495 8.8845 11.2807 8.8845C9.89102 8.8845 9.67872 9.9683 9.67872 11.0887V15.339H7.01322V6.75H9.57372V7.9207H9.60822C9.96602 7.2457 10.836 6.53325 12.1357 6.53325C14.8365 6.53325 15.336 8.3108 15.336 10.6245L15.3352 15.339ZM4.00275 5.57475C3.14475 5.57475 2.4555 4.88025 2.4555 4.026C2.4555 3.1725 3.1455 2.47875 4.00275 2.47875C4.85775 2.47875 5.55075 3.1725 5.55075 4.026C5.55075 4.88025 4.857 5.57475 4.00275 5.57475ZM5.33925 15.339H2.66625V6.75H5.33925V15.339ZM16.6687 0H1.32825C0.594 0 0 0.5805 0 1.29675V16.7033C0 17.4202 0.594 18 1.32825 18H16.6665C17.4 18 18 17.4202 18 16.7033V1.29675C18 0.5805 17.4 0 16.6665 0H16.6687Z" fill="currentColor" />
                  </svg>
                  <span className="fw-500">
                    Linkedin
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row pt-60">
          <div className="col-12">
            <div className="rounded-5 overflow-hidden">
              {/* About 02 banner at its own 1716 × 833 size, with the home hero's
                  scroll drift and About 02's zoom-in fade on load. */}
              <div className="o-drift-frame o-about2-banner">
                <div className="o-hero-drift" data-drift=".8">
                  <div className="o-hero-media" data-zoomin="">
                    <img src="https://images.unsplash.com/photo-1781246212288-7fa538344718?auto=format&fit=crop&w=2000&h=971&q=80" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* About 02 logo ticker. No client logos yet, so it lists the
              sectors we serve; pass `logo` to show an image instead. */}
          <div className="col-12 pt-80 pb-60">
            <div className="at-brand-area border-0">
              <div className="carouselTicker carouselTicker-left position-relative z-1">
                <ul className="carouselTicker__list">
                  {brands.map((b) => (
                    <li key={b.label} className="carouselTicker__item">
                      <div className="brand-item dark-mode-invert">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {b.logo ? <img src={b.logo} alt={b.label} /> : <span className="o-brand-word">{b.label}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

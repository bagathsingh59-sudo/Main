/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/index-12.html` (.sec-1-home-12) by scripts/orisa/port-section.py.
// VaishnaviPay copy; tiles are screenshots from the user manual.
export function P12Hero() {
  return (
    <section className="sec-1-home-12 pt-110" aria-label="Payroll. Compliance. One Login. Hero">
      <div className="sec-1-home-12__hero">
        <div className="container">
          <div className="sec-1-home-12__hero-inner d-flex flex-column align-items-center text-center">
            <div className="sec-1-home-12__pill" data-fade="bottom" data-delay=".05">
              <div className="sec-1-home-12__avatars" aria-hidden="true">
                <img className="sec-1-home-12__avatar" src="/orisa/tpl/pages/home-12/sec-1-avatar-1.webp" alt="" loading="eager" decoding="async" />
                <img className="sec-1-home-12__avatar" src="/orisa/tpl/pages/home-12/sec-1-avatar-2.webp" alt="" loading="eager" decoding="async" />
                <img className="sec-1-home-12__avatar" src="/orisa/tpl/pages/home-12/sec-1-avatar-3.webp" alt="" loading="eager" decoding="async" />
                <img className="sec-1-home-12__avatar" src="/orisa/tpl/pages/home-12/sec-1-avatar-4.webp" alt="" loading="eager" decoding="async" />
              </div>
              <span className="sec-1-home-12__pill-text">
                Built by Vaishnavi Consultant
              </span>
            </div>
            <h1 className="sec-1-home-12__title mb-0" data-rise="">
              <span className="d-block">
                Payroll. Compliance.
              </span>
              <span className="d-block">
                One Login.
              </span>
            </h1>
            <p className="sec-1-home-12__sub mb-0" data-fade="bottom" data-delay=".2">
              {" VaishnaviPay runs payroll, 32 statutory reports, client logins and digitally signed documents — right in your browser. "}
            </p>
            <div className="sec-1-home-12__ctas" data-fade="bottom" data-delay=".3">
              <a className="sec-1-home-12__btn-primary" href="/contact?topic=vaishnavipay-demo">
                <span className="sec-1-home-12__btn-primary-label">
                  Request a demo
                </span>
                <span className="sec-1-home-12__btn-primary-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a className="sec-1-home-12__btn-secondary" href="#pricing">
                <span>
                  See Pricing
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="sec-1-home-12__strip">
        <div className="carouselTicker carouselTicker-left o-marquee sec-1-home-12-slider">
          <div className="carouselTicker__list d-flex">
            <a className="sec-1-home-12__tile sec-1-home-12__tile--brand-1" href="#modules" aria-label="Dashboard">
              <img className="sec-1-home-12__tile-img" src="/vaishnavi-pay/dashboard.webp" alt="VaishnaviPay — Dashboard" loading="lazy" decoding="async" />
            </a>
            <a className="sec-1-home-12__tile sec-1-home-12__tile--neutral-100" href="#modules" aria-label="Payroll">
              <img className="sec-1-home-12__tile-img" src="/vaishnavi-pay/payroll.webp" alt="VaishnaviPay — Payroll" loading="lazy" decoding="async" />
            </a>
            <a className="sec-1-home-12__tile sec-1-home-12__tile--neutral-800" href="#modules" aria-label="PF ECR report">
              <img className="sec-1-home-12__tile-img" src="/vaishnavi-pay/ecr.webp" alt="VaishnaviPay — PF ECR report" loading="lazy" decoding="async" />
            </a>
            <a className="sec-1-home-12__tile sec-1-home-12__tile--brand-2" href="#modules" aria-label="Pay slip">
              <img className="sec-1-home-12__tile-img" src="/vaishnavi-pay/payslip.webp" alt="VaishnaviPay — Pay slip" loading="lazy" decoding="async" />
            </a>
            <a className="sec-1-home-12__tile sec-1-home-12__tile--neutral-300" href="#modules" aria-label="Filing matrix">
              <img className="sec-1-home-12__tile-img" src="/vaishnavi-pay/matrix.webp" alt="VaishnaviPay — Filing matrix" loading="lazy" decoding="async" />
            </a>
            <a className="sec-1-home-12__tile sec-1-home-12__tile--brand-1" href="#modules" aria-label="Document verification">
              <img className="sec-1-home-12__tile-img" src="/vaishnavi-pay/verify.webp" alt="VaishnaviPay — Document verification" loading="lazy" decoding="async" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

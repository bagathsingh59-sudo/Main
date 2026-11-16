/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/services-details.html` (.home-3-section-12) by scripts/orisa/port-section.py.
// The template's newsletter box, as a 'talk to us' prompt (the site has no newsletter).
import Link from "next/link";

export function SdNewsletter() {
  return (
    <div className="home-3-section-12 pb-100">
      <div className="container">
        <div className="box-newsletter bg-neutral-50 pt-80 pb-100 px-md-5 px-4">
          <div className="row g-4">
            <div className="col-lg-2">
              <div className="ripple-image ripples rounded-3 overflow-hidden d-inline-flex">
                <img
                  className="img-cover"
                  src="/orisa/tpl/pages/img-74.webp"
                  alt=""
                />
              </div>
            </div>
            <div className="col-lg-5">
              <span className="at-btn common-black bg-transparent mb-10 rounded-0 p-0">
                <span className="text-uppercase">
                  <span className="text-1">questions?</span>
                  <span className="text-2">questions?</span>
                </span>
                <i>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                      fill="currentColor"
                    />
                  </svg>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z"
                      fill="currentColor"
                    />
                  </svg>
                </i>
              </span>
              <h2>Not sure where to start?</h2>
              <p className="fz-font-xl mb-0">
                Tell us your headcount and the states you operate in — we’ll
                tell you exactly which registrations and returns apply.
              </p>
            </div>
            <div className="col-lg-4 ms-auto align-self-end">
              <Link className="at-btn" href="/contact">
                <span>
                  <span className="text-1">Talk to a consultant</span>
                  <span className="text-2">Talk to a consultant</span>
                </span>
              </Link>
              <p className="mb-0 pt-20">
                A senior consultant replies within one working day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

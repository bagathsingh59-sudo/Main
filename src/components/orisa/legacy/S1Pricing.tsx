/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/services-1.html` (.home-2-section-12) by scripts/orisa/port-section.py.
// PLACEHOLDER service prices (from the old site) — confirm before launch.
import { DEFAULT_CONTACT, telHref, type SiteContact } from "./contact";

export function S1Pricing({ contact = DEFAULT_CONTACT }: { contact?: SiteContact }) {
  return (
    <div className="home-2-section-12 rounded-5 overflow-hidden mx-lg-3 mx-2 mt-50 p-relative pt-100 pb-100 pt-0">
      <div className="p-absolute top-0 left-0 w-100 h-100 rounded-5 opacity-10 z-0 d-none" style={{ backgroundImage: "url('/orisa/tpl/pages/noise.gif')" }} />
      <div className="container p-relative z-1">
        <div className="row g-4">
          <div className="col-lg-2 p-relative d-flex flex-column justify-content-between align-items-start">
            <span className="at-btn common-black bg-transparent rounded-0 p-0">
              <span className="text-uppercase">
                <span className="text-1">
                  {"pricing "}
                </span>
                <span className="text-2">
                  {"pricing "}
                </span>
              </span>
              <i>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                </svg>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                </svg>
              </i>
            </span>
            <div className="at-about-svg-wrap move-up d-none d-xxl-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="57" height="91" viewBox="0 0 57 91" fill="none">
                <path opacity="0.1" d="M0 0L56.4024 33.572V90.336L0 56.46V0Z" fill="#515151" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="113" height="68" viewBox="0 0 113 68" fill="none">
                <path opacity="0.3" d="M0 33.876L56.4024 0L112.805 33.876V34.1294L56.4024 68.0054L0 34.1294V33.876Z" fill="#515151" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="57" height="91" viewBox="0 0 57 91" fill="none">
                <path opacity="0.2" d="M56.4009 0L8.7738e-05 33.5367V90.2413L56.4009 56.4008V0Z" fill="#515151" />
              </svg>
            </div>
          </div>
          <div className="col-3xl-8 col-xxl-10 col-lg-10 col-md-12">
            <div className="row align-items-end mb-60 g-4">
              <div className="col-lg-8">
                <h2 className="h3 fw-700 mb-0" data-reveal="">
                  Modular pricing. Pick the services you need.
                </h2>
              </div>
            </div>
            <div className="row justify-content-center g-4">
              <div className="col-lg-4">
                <div className="home-2-pricing-card bg-neutral-50">
                  <div className="home-2-pricing-card__body">
                    <h3 className="h4 home-2-pricing-card__title">
                      Payroll
                    </h3>
                    <div className="home-2-pricing-card__price">
                      <span className="home-2-pricing-card__price-value text-price-starter">
                        ₹49
                      </span>
                      <span className="home-2-pricing-card__price-period">
                        /employee / month
                      </span>
                    </div>
                    <p className="home-2-pricing-card__desc">
                      Monthly payroll run, pay slips and Form 16 for your whole team.
                    </p>
                    <a className="at-btn px-5" href="#">
                      <span>
                        <span className="text-1 text-capitalize">
                          Get a quote
                        </span>
                        <span className="text-2 text-capitalize">
                          Get a quote
                        </span>
                      </span>
                      <i>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                        </svg>
                      </i>
                    </a>
                  </div>
                  <ul className="home-2-pricing-card__features">
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Automated salary runs "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Reimbursements & arrears "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Pay slips for every employee "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Form 16 & 24Q "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Statutory registers "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="home-2-pricing-card bg-neutral-50 home-2-pricing-card--popular">
                  <span className="home-2-pricing-card__badge">
                    Most popular
                  </span>
                  <div className="home-2-pricing-card__body">
                    <h3 className="h4 home-2-pricing-card__title">
                      EPF &amp; ESI
                    </h3>
                    <div className="home-2-pricing-card__price">
                      <span className="home-2-pricing-card__price-value text-price-growth">
                        ₹15,000
                      </span>
                      <span className="home-2-pricing-card__price-period">
                        /quarter
                      </span>
                    </div>
                    <p className="home-2-pricing-card__desc">
                      PF and ESI filings, KYC and inspection support, owned end to end.
                    </p>
                    <a className="at-btn px-5" href="#">
                      <span>
                        <span className="text-1 text-capitalize">
                          Get a quote
                        </span>
                        <span className="text-2 text-capitalize">
                          Get a quote
                        </span>
                      </span>
                      <i>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                        </svg>
                      </i>
                    </a>
                  </div>
                  <ul className="home-2-pricing-card__features">
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Monthly ECR upload "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" ESI contributions &amp; returns "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" UAN / KYC handling "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Inspection support "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Challan tracking "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="home-2-pricing-card bg-neutral-50">
                  <div className="home-2-pricing-card__body">
                    <h3 className="h4 home-2-pricing-card__title">
                      Labour Law
                    </h3>
                    <div className="home-2-pricing-card__price">
                      <span className="home-2-pricing-card__price-value text-price-scale">
                        Custom
                      </span>
                      <span className="home-2-pricing-card__price-period">
                        /quote
                      </span>
                    </div>
                    <p className="home-2-pricing-card__desc">
                      S&amp;E, PT, LWF, bonus and gratuity — registrations, returns and renewals.
                    </p>
                    <a className="at-btn px-5" href="#">
                      <span>
                        <span className="text-1 text-capitalize">
                          Get a quote
                        </span>
                        <span className="text-2 text-capitalize">
                          Get a quote
                        </span>
                      </span>
                      <i>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                        </svg>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.21967 9.40717C-0.0732232 9.70006 -0.0732232 10.1749 0.21967 10.4678C0.512563 10.7607 0.987437 10.7607 1.28033 10.4678L0.21967 9.40717ZM10.6875 0.75C10.6875 0.335786 10.3517 2.97145e-09 9.9375 1.50485e-07L3.1875 -2.70983e-07C2.77329 -2.70983e-07 2.4375 0.335786 2.4375 0.75C2.4375 1.16421 2.77329 1.5 3.1875 1.5H9.1875V7.5C9.1875 7.91421 9.52329 8.25 9.9375 8.25C10.3517 8.25 10.6875 7.91421 10.6875 7.5L10.6875 0.75ZM0.75 9.9375L1.28033 10.4678L10.4678 1.28033L9.9375 0.75L9.40717 0.21967L0.21967 9.40717L0.75 9.9375Z" fill="currentColor" />
                        </svg>
                      </i>
                    </a>
                  </div>
                  <ul className="home-2-pricing-card__features">
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Shops & Establishments "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Professional tax "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" LWF returns "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Bonus & gratuity "}
                    </li>
                    <li>
                      <span className="home-2-pricing-card__feature-icon dark-mode-invert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z" fill="currentColor" />
                        </svg>
                      </span>
                      {" Inspection support "}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="d-flex gap-3 mt-60">
                  <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 20C5.286 20 2.929 20 1.464 18.535C0 17.072 0 14.714 0 10C0 5.286 0 2.929 1.464 1.464C2.93 0 5.286 0 10 0C14.714 0 17.071 0 18.535 1.464C20 2.93 20 5.286 20 10C20 14.714 20 17.071 18.535 18.535C17.072 20 14.714 20 10 20ZM10 5.75C9.379 5.75 8.875 6.254 8.875 6.875C8.875 7.07391 8.79598 7.26468 8.65533 7.40533C8.51468 7.54598 8.32391 7.625 8.125 7.625C7.92609 7.625 7.73532 7.54598 7.59467 7.40533C7.45402 7.26468 7.375 7.07391 7.375 6.875C7.37501 6.44494 7.48069 6.02146 7.68274 5.64182C7.88479 5.26218 8.17702 4.93799 8.53374 4.69777C8.89046 4.45754 9.30073 4.30865 9.72849 4.26416C10.1562 4.21968 10.5884 4.28098 10.9869 4.44266C11.3854 4.60435 11.7381 4.86147 12.0139 5.19142C12.2898 5.52137 12.4803 5.91403 12.5688 6.33489C12.6573 6.75575 12.6411 7.19191 12.5215 7.60501C12.4019 8.01811 12.1826 8.3955 11.883 8.704C11.791 8.79867 11.703 8.88767 11.619 8.971C11.4165 9.16504 11.2258 9.37108 11.048 9.588C10.828 9.87 10.75 10.077 10.75 10.25V11C10.75 11.1989 10.671 11.3897 10.5303 11.5303C10.3897 11.671 10.1989 11.75 10 11.75C9.80109 11.75 9.61032 11.671 9.46967 11.5303C9.32902 11.3897 9.25 11.1989 9.25 11V10.25C9.25 9.595 9.555 9.064 9.864 8.667C10.093 8.373 10.38 8.087 10.614 7.853C10.6847 7.783 10.749 7.71833 10.807 7.659C10.9611 7.5004 11.0651 7.2999 11.1059 7.08255C11.1467 6.8652 11.1225 6.64065 11.0364 6.43696C10.9503 6.23326 10.8061 6.05947 10.6217 5.93729C10.4374 5.81511 10.2211 5.74997 10 5.75ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="h6 fw-600">
                      Rather do it yourself?
                    </h4>
                    <p className="fz-font-lg neutral-700">
                      VaishnaviPay is the software our own team uses — plans from ₹1,000 a month. Or tell us your headcount and states for a custom quote.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3" />
            </div>
          </div>
          <div className="col-xxl-2 text-end d-flex flex-column gap-2">
            <a className="text-decoration-underline" href="/contact">
              Contact Us
            </a>
            <p className="h6 fw-600 mb-0">
              <a href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </p>
            <p className="h6 fw-600 mb-0">
              <a href={telHref(contact.phone)}>
                {contact.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

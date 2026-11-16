/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/index-7.html` (.sec-4-home-7) by scripts/orisa/port-section.py.
// Vaishnavi copy; contact details mirror Admin → Contact info defaults.
import { DEFAULT_CONTACT, telHref, type SiteContact } from "./contact";

export function H7Partner({ contact = DEFAULT_CONTACT }: { contact?: SiteContact }) {
  const c = contact;
  return (
    <div className="sec-4-home-7 bg-neutral-50 pt-120 pb-120">
      <div className="container-2200 px-lg-5 px-3">
        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-xl-3 col-lg-4 col-12">
            <div className="sec-4-home-7__eyebrow d-inline-flex align-items-center gap-2 mb-4 text-uppercase">
              <span data-scramble-text="Our promise" data-scramble="">
                Our promise
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M11.0037 3.41421L2.39712 12.0208L0.98291 10.6066L9.5895 2H2.00373V0H13.0037V11H11.0037V3.41421Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div
              className="sec-4-home-7__frame overflow-hidden mt-4 at-hover-parallax"
              data-parallax-strength="18"
              data-parallax-scale="1.05"
            >
              <img
                className="sec-4-home-7__img fix"
                src="https://images.unsplash.com/photo-1787724779349-18ba0352c154?auto=format&fit=crop&w=1440&h=1800&q=80&crop=faces"
                alt=""
                width="377"
                height="471"
                loading="lazy"
                decoding="async"
                data-zoomin=""
              />
            </div>
          </div>
          <div className="col-xl-9 col-lg-8 col-12">
            <h2 className="sec-4-home-7__title mb-4 mb-lg-5">
              <span
                className="sec-4-home-7__title-part sec-4-home-7__title-part--950"
                data-reveal=""
              >
                More than a consultant, we act as your compliance desk,
                delivering accurate, on-time filings that keep your business
                penalty-free.
              </span>
            </h2>
            <div
              className="sec-4-home-7__cta d-inline-flex align-items-stretch mb-60"
              data-fade="bottom"
            >
              <a
                className="at-btn sec-4-home-7__cta-btn text-capitalize"
                href="/about"
              >
                <span>
                  <span className="text-1">Meet our team</span>
                  <span className="text-2">Meet our team</span>
                </span>
              </a>
              <a
                className="sec-4-home-7__cta-circle d-inline-flex align-items-center justify-content-center text-white"
                href="/about"
                aria-label="Meet our team"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M7 17L17 7M17 7H9M17 7V15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
            <div className="sec-4-home-7__locations row g-4 g-lg-5">
              <div className="col-lg-6 col-12">
                <div className="d-flex gap-4">
                  <div
                    className="sec-4-home-7__pin flex-shrink-0"
                    aria-hidden="true"
                  >
                    <img
                      src="/orisa/tpl/pages/home-7/sec-4-pin-icon.svg"
                      width="40"
                      height="40"
                      alt=""
                    />
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <h3
                      className="sec-4-home-7__loc-title h6 mb-3"
                      data-chars=""
                    >
                      We are here
                    </h3>
                    <div className="sec-4-home-7__loc-body" data-fade="bottom">
                      <p className="mb-2">
                        {`${c.addressLine1}, ${c.addressLine2}`}
                        <br />
                        {`${c.city}, ${c.state} ${c.pin}`}
                      </p>
                      <p className="mb-2">
                        {" Phone: "}
                        <a
                          className="sec-4-home-7__loc-strong"
                          href={telHref(c.phone)}
                        >
                          {c.phone}
                        </a>
                      </p>
                      <p className="mb-0">
                        {" Email: "}
                        <a
                          className="sec-4-home-7__loc-strong"
                          href={`mailto:${c.email}`}
                        >
                          {c.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div
                  className="sec-4-home-7__loc-body sec-4-home-7__loc-body--solo ps-lg-4"
                  data-fade="bottom"
                >
                  <p className="mb-2">
                    Also serving Bidar and Hyderabad
                    <br />
                    remotely and on site
                  </p>
                  <p className="mb-2">
                    {" Phone: "}
                    <a
                      className="sec-4-home-7__loc-strong"
                      href={telHref(c.altPhone || c.phone)}
                    >
                      {c.altPhone || c.phone}
                    </a>
                  </p>
                  <p className="mb-0">
                    {" Email: "}
                    <a
                      className="sec-4-home-7__loc-strong"
                      href={`mailto:${c.supportEmail || c.email}`}
                    >
                      {c.supportEmail || c.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

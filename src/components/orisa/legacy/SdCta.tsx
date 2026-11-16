/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/services-details.html` (.sec-5-services-details) by scripts/orisa/port-section.py.
// Template copy and images are kept as placeholders — edit freely.
export interface SdCtaProps {
  heading: string;
  /** Up to four deliverables, shown in two columns. */
  receive: string[];
  promise: string;
}

export function SdCta({ heading, receive, promise }: SdCtaProps) {
  return (
    <div className="sec-5-services-details pt-120 pb-120 p-relative border-bottom-100">
      <div className="position-absolute w-100 h-100 d-grid top-0 md:grid-cols-7 gap-0 z-n1 opacity-10">
        <div className="position-relative h-100 overflow-hidden d-md-block border-dark/01">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
        </div>
        <div className="position-relative h-100 overflow-hidden d-md-block border-dark/01">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
        </div>
        <div className="position-relative h-100 overflow-hidden d-md-block border-dark/01">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
        </div>
        <div className="position-relative h-100 border-r border-dark/01 md:border-none">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
          <div className="absolute top-[20%] left-0 right-0 h-[30%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
        <div className="position-relative h-100 overflow-hidden d-md-block border-dark/01">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
        </div>
        <div className="position-relative h-100 overflow-hidden d-md-block border-dark/01">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
        </div>
        <div className="position-relative h-100 overflow-hidden d-md-block border-dark/01">
          <div className="absolute bottom-0 left-0 right-0 border-white/10" />
        </div>
      </div>
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <img src="https://images.unsplash.com/photo-1771244688590-1e481dba1b5a?auto=format&fit=crop&w=1596&h=1596&q=80" alt="" />
          </div>
          <div className="col-lg-5 mx-auto">
            <span className="at-btn common-black text-uppercase bg-transparent mb-10 rounded-0 p-0">
              <span className="text-uppercase">
                <span className="text-1">What you’ll receive</span>
                <span className="text-2">What you’ll receive</span>
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
            <span className="h4 mb-0 fw-600 pe-lg-5">{heading}</span>
            <div className="row pt-30 pb-80">
              {[0, 1].map((col) => (
                <div key={col} className="col-md-6">
                  {receive
                    .filter((_, i) => i % 2 === col)
                    .map((r) => (
                      <div
                        key={r}
                        className="d-flex align-items-center gap-2 mb-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <path
                            d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM8 5V8H5V10H8V13H10V10H13V8H10V5H8Z"
                            fill="currentColor"
                          />
                        </svg>
                        <p className="mb-0 fz-font-md neutral-700">{r}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
            <div className="testimonial-author d-flex align-items-start mb-0 gap-4">
              <div>
                <div className="testimonial-left-img size-50 rounded-3 overflow-hidden">
                  <img src="/brand/logo-128.png" alt="" />
                </div>
              </div>
              <div className="testimonial-content">
                <p className="fz-xl neutral-900 fw-400">{`“${promise}”`}</p>
                <span className="h6 testimonial-content-author-name fw-600 mb-0 fz-font-md">
                  Vaishnavi Consultant
                </span>
                <p className="testimonial-content-author-position m-0 fz-font-label">
                  Compliance desk
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

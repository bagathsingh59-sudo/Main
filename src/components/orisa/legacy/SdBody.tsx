/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/services-details.html` (.sec-3-services-details) by scripts/orisa/port-section.py.
// Template copy and images are kept as placeholders — edit freely.
export interface SdBodyProps {
  label: string;
  heading: string;
  sub: string;
  items: { title: string; text?: string }[];
}

export function SdBody({ label, heading, sub, items }: SdBodyProps) {
  return (
    <div className="sec-3-services-details pb-120">
      <div className="container section-fix pt-100">
        <div className="row">
          <div className="col-lg-5 h-100">
            <span className="at-btn common-black text-uppercase bg-transparent mb-10 rounded-0 p-0">
              <span className="text-uppercase">
                <span className="text-1">{label}</span>
                <span className="text-2">{label}</span>
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
            <h3 className="mb-40">{heading}</h3>
            <span className="h6 fw-600 mb-0">{sub}</span>
            <div className="section-title-pin" />
          </div>
          <div className="col-xxl-6 col-lg-7 offset-xxl-1 p-relative">
            <div className="scroll-section vertical-section section scroll-active-item">
              <div className="wrapper">
                <div className="list" role="list">
                  {items.map((it) => (
                    <div key={it.title} className="item">
                      <div className="container bg-neutral-0 rounded-4 border-100 p-relative">
                        <div className="rectangular bg-neutral-0 border-100" />
                        <div className="row align-items-center py-3">
                          <div className="col-12 h-100">
                            <div className="d-flex flex-column p-md-5 p-3 justify-content-between h-100">
                              <div className="icon pb-20">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="48"
                                  height="48"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                >
                                  <path
                                    d="M12 24C18.6274 24 24 18.6274 24 12C24 18.6259 29.37 23.9975 35.9953 24C29.37 24.0025 24 29.3742 24 36C24 29.3726 18.6274 24 12 24C5.37258 24 8.1423e-07 29.3726 5.24536e-07 36L0 48L12 48C18.6274 48 24 42.6274 24 36C24 42.6274 29.3726 48 36 48L48 48L48 36C48 29.3742 42.63 24.0025 36.0047 24C42.63 23.9975 48 18.6259 48 12L48 9.34594e-06L36 9.87048e-06C29.3726 6.34548e-06 24 5.37259 24 12C24 5.37259 18.6274 6.81516e-06 12 7.10486e-06L4.19629e-06 3.8147e-06L2.62268e-06 12C1.7536e-06 18.6274 5.37258 24 12 24Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </div>
                              <span className={it.text ? "h5 mb-4" : "h5 mb-0"}>{it.title}</span>
                              {it.text && <p className="mb-0 fz-font-lg">{it.text}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

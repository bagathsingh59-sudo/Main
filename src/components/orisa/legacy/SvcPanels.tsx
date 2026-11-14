/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `services-1.html` (.at-service-area) by scripts/orisa/port-section.py.
// Template copy and images are kept as placeholders — edit freely.
export function SvcPanels() {
  return (
    <div className="at-service-area at-panel-pin-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="at-service-subtitle-wrap at-about-border d-flex justify-content-between gap-3 mb-50">
              <span className="at-btn common-black text-uppercase bg-transparent mb-10 rounded-0 p-0">
                <span className="text-uppercase">
                  <span className="text-1">
                    OUR SERVICES
                  </span>
                  <span className="text-2">
                    OUR SERVICES
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
              <span className="fs-font-md fw-500 text-decoration-underline">
                Since 2018
              </span>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-4 col-xl-4 mb-40">
            <div className="at-service-content mr-60 mt-20">
              <div className="at-service-sales-wrap at-panel-pin fix p-relative">
                <div className="at-service-img-wrapper image-container">
                  <div className="hover-image">
                    <img className="thumb" src="/orisa/tpl/pages/img-5.webp" alt="Service Image" />
                  </div>
                  <div className="hover-image">
                    <img className="thumb" src="/orisa/tpl/pages/img-6.webp" alt="Service Image" />
                  </div>
                  <div className="hover-image">
                    <img className="thumb" src="/orisa/tpl/pages/img-7.webp" alt="Service Image" />
                  </div>
                  <div className="hover-image">
                    <img className="thumb" src="/orisa/tpl/pages/img-8.webp" alt="Service Image" />
                  </div>
                  <div className="hover-image">
                    <img className="thumb" src="/orisa/tpl/pages/img-9.webp" alt="Service Image" />
                  </div>
                  <div className="hover-image">
                    <img className="thumb" src="/orisa/tpl/pages/img-10.webp" alt="Service Image" />
                  </div>
                </div>
                <h4 className="h5 fw-600 mb-0 mt-10">
                  <span data-count="250" />
                  +
                </h4>
                <span className="fz-font-lg neutral-500 fw-500">
                  Businesses served
                </span>
              </div>
            </div>
          </div>
          <div className="col-xxl-7 ms-auto col-lg-8 col-xl-8 mb-40">
            <div className="at-service-list-wrap">
              <a href="/contact?service=payroll">
                <div className="at-service-item service-item">
                  <div className="count">
                    <span className="number">
                      [01]
                    </span>
                  </div>
                  <div className="content">
                    <h1 className="title">
                      Payroll Management
                    </h1>
                    <p className="text">
                      {" End-to-end payroll, payslips and "}
                      <br />
                      {" Form 16 for your whole workforce. "}
                    </p>
                  </div>
                  <div className="thumb" data-zoomin="">
                    <img src="/orisa/tpl/pages/img-5-sm.webp" alt="" />
                  </div>
                </div>
              </a>
              <a href="/contact?service=epf-esi">
                <div className="at-service-item service-item">
                  <div className="count">
                    <span className="number">
                      [02]
                    </span>
                  </div>
                  <div className="content">
                    <h1 className="title">
                      {"EPF & ESI Compliance"}
                    </h1>
                    <p className="text">
                      {" PF ECR, ESI returns, KYC and "}
                      <br />
                      {" inspection support, end to end. "}
                    </p>
                  </div>
                  <div className="thumb" data-zoomin="">
                    <img src="/orisa/tpl/pages/img-6-sm.webp" alt="" />
                  </div>
                </div>
              </a>
              <a href="/contact?service=labour-law">
                <div className="at-service-item service-item">
                  <div className="count">
                    <span className="number">
                      [03]
                    </span>
                  </div>
                  <div className="content">
                    <h1 className="title">
                      Labour Law Compliance
                    </h1>
                    <p className="text">
                      {" S&E, PT, LWF, contract labour, "}
                      <br />
                      {" bonus and gratuity registers. "}
                    </p>
                  </div>
                  <div className="thumb" data-zoomin="">
                    <img src="/orisa/tpl/pages/img-7-sm.webp" alt="" />
                  </div>
                </div>
              </a>
              <a href="/contact?service=gst">
                <div className="at-service-item service-item">
                  <div className="count">
                    <span className="number">
                      [04]
                    </span>
                  </div>
                  <div className="content">
                    <h1 className="title">
                      GST Compliance
                    </h1>
                    <p className="text">
                      {" GSTR-1, 3B, 9 and 9C with "}
                      <br />
                      {" reconciliation and refunds. "}
                    </p>
                  </div>
                  <div className="thumb" data-zoomin="">
                    <img src="/orisa/tpl/pages/img-8-sm.webp" alt="" />
                  </div>
                </div>
              </a>
              <a href="/contact?service=income-tax">
                <div className="at-service-item service-item">
                  <div className="count">
                    <span className="number">
                      [05]
                    </span>
                  </div>
                  <div className="content">
                    <h1 className="title">
                      Income Tax Advisory
                    </h1>
                    <p className="text">
                      {" Corporate returns, TDS, advance "}
                      <br />
                      {" tax and tax planning. "}
                    </p>
                  </div>
                  <div className="thumb" data-zoomin="">
                    <img src="/orisa/tpl/pages/img-9-sm.webp" alt="" />
                  </div>
                </div>
              </a>
              <a href="/contact?service=cfo">
                <div className="at-service-item service-item">
                  <div className="count">
                    <span className="number">
                      [06]
                    </span>
                  </div>
                  <div className="content">
                    <h1 className="title">
                      Virtual CFO Advisory
                    </h1>
                    <p className="text">
                      {" Monthly MIS, board packs and "}
                      <br />
                      {" fund-raise readiness. "}
                    </p>
                  </div>
                  <div className="thumb" data-zoomin="">
                    <img src="/orisa/tpl/pages/img-10-sm.webp" alt="" />
                  </div>
                </div>
              </a>
              <div className="at-service-btn pt-30">
                <a className="at-btn" href="/contact">
                  <span>
                    <span className="text-1">
                      Book a free consultation
                    </span>
                    <span className="text-2">
                      Book a free consultation
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

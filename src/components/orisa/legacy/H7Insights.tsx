/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/index-7.html` (.sec-10-home-7) by scripts/orisa/port-section.py.
// Template 'Insights' block: four compliance guides, each opening its service page (no blog). Images are placeholders.
export function H7Insights() {
  return (
    <div className="sec-10-home-7 bg-neutral-0 pt-120 pb-120">
      <div className="container-2200 px-lg-5 px-3">
        <div className="row align-items-end mb-50">
          <div className="col-xl-4 col-lg-4 col-12">
            <a
              className="sec-10-home-7__eyebrow d-inline-flex align-items-center gap-2 mb-4 text-uppercase"
              href="/services"
            >
              <span data-scramble-text="Compliance guides" data-scramble="">
                Compliance guides
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
              >
                <path
                  d="M11.0037 3.41421L2.39712 12.0208L0.98291 10.6066L9.5895 2H2.00373V0H13.0037V11H11.0037V3.41421Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <h2 className="sec-10-home-7__title mb-0" data-reveal="">
              {"Guides for "}
              <br className="d-none d-sm-inline" />
              Business Owners
            </h2>
          </div>
          <div className="col-xl-5 col-lg-6 col-12 mt-4 mt-xl-0">
            <p className="sec-10-home-7__lead mb-0" data-reveal="">
              {
                " Plain-language answers to what is due, when, and how we handle it — straight from the people who file it every month. "
              }
            </p>
          </div>
          <div className="col-xl-3 col-lg-12 mt-4 mt-lg-4 mt-xl-0 ms-xl-auto text-xl-end">
            <a
              className="sec-10-home-7__btn-all d-inline-flex align-items-center gap-2"
              href="/services"
              data-fade="bottom"
            >
              <span>All services</span>
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
            </a>
          </div>
        </div>
        <div className="row g-3 sec-10-home-7__grid">
          <div
            className="blog-card col-lg-3 col-md-6 col-12 mb-30"
            data-category=""
          >
            <div className="blog-card__thumb hover-effect-1">
              <a className="blog-card__img-link" href="/services/payroll">
                <img
                  className="blog-card__img22"
                  src="/orisa/tpl/pages/home-7/insight-1-retro.webp"
                  alt=""
                />
              </a>
            </div>
            <div className="blog-card__content">
              <h2 className="h6 blog-card__title">
                <a className="blog-card__title-link" href="/services/payroll">
                  {"Your monthly payroll compliance checklist"}
                </a>
              </h2>
              <p className="blog-card__meta">
                <span className="blog-card__meta-text">{"Payroll · Compliance guide"}</span>
              </p>
            </div>
          </div>
          <div
            className="blog-card col-lg-3 col-md-6 col-12 mb-30"
            data-category=""
          >
            <div className="blog-card__thumb hover-effect-1">
              <a className="blog-card__img-link" href="/services/epf-esi">
                <img
                  className="blog-card__img22"
                  src="/orisa/tpl/pages/home-7/insight-2-office.webp"
                  alt=""
                />
              </a>
            </div>
            <div className="blog-card__content">
              <h2 className="h6 blog-card__title">
                <a className="blog-card__title-link" href="/services/epf-esi">
                  {"PF ECR and ESIC returns: dates, files and common rejections"}
                </a>
              </h2>
              <p className="blog-card__meta">
                <span className="blog-card__meta-text">{"EPF & ESIC · Compliance guide"}</span>
              </p>
            </div>
          </div>
          <div
            className="blog-card col-lg-3 col-md-6 col-12 mb-30"
            data-category=""
          >
            <div className="blog-card__thumb hover-effect-1">
              <a className="blog-card__img-link" href="/services/gst">
                <img
                  className="blog-card__img22"
                  src="/orisa/tpl/pages/home-7/insight-3-fabric.webp"
                  alt=""
                />
              </a>
            </div>
            <div className="blog-card__content">
              <h2 className="h6 blog-card__title">
                <a className="blog-card__title-link" href="/services/gst">
                  {"GSTR-1, GSTR-3B and TDS: what is due when"}
                </a>
              </h2>
              <p className="blog-card__meta">
                <span className="blog-card__meta-text">{"GST & TDS · Compliance guide"}</span>
              </p>
            </div>
          </div>
          <div
            className="blog-card col-lg-3 col-md-6 col-12 mb-30"
            data-category=""
          >
            <div className="blog-card__thumb hover-effect-1">
              <a className="blog-card__img-link" href="/services/labour-law">
                <img
                  className="blog-card__img22"
                  src="/orisa/tpl/pages/home-7/insight-4-conference.webp"
                  alt=""
                />
              </a>
            </div>
            <div className="blog-card__content">
              <h2 className="h6 blog-card__title">
                <a className="blog-card__title-link" href="/services/labour-law">
                  {"Shops & Establishments, PT and LWF in Karnataka"}
                </a>
              </h2>
              <p className="blog-card__meta">
                <span className="blog-card__meta-text">{"Labour law · Compliance guide"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

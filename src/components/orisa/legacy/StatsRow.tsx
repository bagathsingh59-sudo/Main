/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `about-1.html` (.home-2-section-9) by scripts/orisa/port-section.py.
// Template copy and images are kept as placeholders — edit freely.
export function StatsRow() {
  return (
    <div className="home-2-section-9 at-item-anime-area">
      <div className="container pt-100 pb-100">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-6 text-center">
            <h2 className="h1 fz-ds-1 fw-500 mb-0 text-nowrap">

              <span data-count="250" />
              +
            </h2>
            <h3 className="h6 fw-500">
              {"Businesses served "}
              <br />
              {" across three cities"}
            </h3>
          </div>
          <div className="col-lg-4 col-md-6 col-6 text-center">
            <h2 className="h1 fz-ds-1 fw-500 mb-0 text-nowrap">
              <span data-count="12" />
              K+
            </h2>
            <h3 className="h6 fw-500">
              {"Statutory filings "}
              <br />
              {" completed"}
            </h3>
          </div>
          <div className="col-lg-4 col-md-6 col-6 text-center">
            <h2 className="h1 fz-ds-1 fw-500 mb-0 text-nowrap">
              <span data-count="25" />
              +
            </h2>
            <h3 className="h6 fw-500">
              {"Years of combined "}
              <br />
              {" practice"}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

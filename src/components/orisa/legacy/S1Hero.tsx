/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/services-1.html` (.sec-1-services) by scripts/orisa/port-section.py.
// Contact line from Admin → Contact info; banner image is a template placeholder.
import { DEFAULT_CONTACT, telHref, type SiteContact } from "./contact";

export function S1Hero({ contact = DEFAULT_CONTACT }: { contact?: SiteContact }) {
  return (
    <div className="sec-1-services pt-150 border-bottom-100 overflow-hidden">
      <div className="container">
        <div className="row align-items-center mb-20">
          <div className="col-lg-9">
            <h1 className="section-title d-flex fw-600 fz-200 mb-0" data-reveal="">
              Vaishnavi Consultant
            </h1>
          </div>
          <div className="col-lg-3 ms-auto text-lg-end">
            <h2 className="h5">
              <a className="text-decoration-none" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </h2>
            <h3 className="h6 fw-600">
              <a className="text-decoration-none" href={telHref(contact.phone)}>
                {contact.phone}
              </a>
            </h3>
          </div>
        </div>
      </div>
      <div className="at-banner-thumb overflow-hidden scale-up-img">
        <img className="img-cover scale-up" src="/orisa/tpl/pages/img-153.webp" alt="" />
      </div>
    </div>
  );
}

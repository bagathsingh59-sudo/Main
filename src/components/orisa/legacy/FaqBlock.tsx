/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `services-1.html` (.alt-faq-area) by scripts/orisa/port-section.py.
// Questions come from Admin → FAQ; the defaults below show when it is empty.
export interface FaqBlockItem {
  question: string;
  answer: string;
}

export const DEFAULT_FAQ: FaqBlockItem[] = [
  {
    "question": "How do you make sure filings are never late?",
    "answer": "Every client gets a named compliance manager, a four-eye review on each filing, deadline trackers and a pre-filing check. If a penalty arises from our oversight, we cover it."
  },
  {
    "question": "How long does onboarding take?",
    "answer": "Usually 7–14 working days: a compliance health-check on day one, the engagement plan by day three and your filings running by week two."
  },
  {
    "question": "Can we switch to you in the middle of the year?",
    "answer": "Yes. We collect the data from your previous consultant, reconcile past filings and take over without interrupting any ongoing return."
  },
  {
    "question": "Do you handle PF and ESI notices and inspections?",
    "answer": "Yes. Drafting replies to notices and supporting you during inspections are part of our EPF & ESI compliance service."
  }
];

export function FaqBlock({ items = DEFAULT_FAQ }: { items?: FaqBlockItem[] }) {
  return (
    <div className="alt-faq-area pt-145 pb-80 border-top-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <div className="alt-faq-title-wrap mb-40">
              <div className="rounded-4 overflow-hidden" data-zoomin="">
                <img className="w-100" src="/orisa/tpl/pages/img-21.webp" alt="" />
              </div>
              <h3 className="h6 fw-600 mb-15 pt-50">
                Still have a question?
              </h3>
              <p className="at-faq-dec mb-35">
                A senior consultant replies within one working day
              </p>
              <div className="at-btn-group" data-fade="bottom" data-delay=".4">
                <a className="at-btn-circle" href="/contact">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                    <path d="M0.0001297 8.99993L0 3.00407e-05L2 0L2.0001 6.99993L12.1719 7.00003L8.22224 3.05027L9.63644 1.63606L16.0003 8.00003L9.63644 14.364L8.22224 12.9497L12.1719 9.00003L0.0001297 8.99993Z" fill="currentColor" />
                  </svg>
                </a>
                <a className="at-btn z-index-1" href="/contact">
                  Talk to us
                </a>
                <a className="at-btn-circle" href="/contact">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                    <path d="M0.0001297 8.99993L0 3.00407e-05L2 0L2.0001 6.99993L12.1719 7.00003L8.22224 3.05027L9.63644 1.63606L16.0003 8.00003L9.63644 14.364L8.22224 12.9497L12.1719 9.00003L0.0001297 8.99993Z" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="at-faq ml-115">
              <span className="at-btn common-black bg-transparent mb-10 rounded-0 p-0">
                <span className="text-uppercase">
                  <span className="text-1">
                    FAQ
                  </span>
                  <span className="text-2">
                    FAQ
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
              <h3 className="at-section-title fw-600" data-reveal="">
                {" Straight answers to the questions business owners ask us first. "}
              </h3>
              <div className="accordion pt-80" id="faqAccordion">
                {items.map((item, i) => (
                  <div key={item.question} className="at-faq-item scroll-move-up rounded-4">
                    <div className="at-faq-header d-flex gap-2">
                      <div className="box-number">
                        <span className="at-faq-number">{i + 1}</span>
                      </div>
                      <button
                        className={i === 0 ? "at-faq-button" : "at-faq-button collapsed"}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq-${i}`}
                        aria-expanded={i === 0}
                        aria-controls={`faq-${i}`}
                      >
                        {item.question}
                      </button>
                    </div>
                    <div className={i === 0 ? "at-faq-collapse collapse show" : "at-faq-collapse collapse"} id={`faq-${i}`} data-bs-parent="#faqAccordion">
                      <div className="at-faq-body">
                        {item.answer.split(/\n{2,}/).map((para, j) => (
                          <p key={j}>{para}</p>
                        ))}
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
  );
}

/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `about-2.html` (.sec-2-about) by scripts/orisa/port-section.py.
// Cards come from Admin → Team; placeholder people until it has members.
import { DEFAULT_TEAM, type TeamBlockMember } from "./TeamBlock";

export function AboutTwoTeam({
  members = DEFAULT_TEAM.slice(0, 3),
}: {
  members?: TeamBlockMember[];
}) {
  return (
    <div className="sec-2-about pt-120 pb-120">
      <div className="container">
        <div className="row pb-60">
          <div className="col-xxl-1 col-lg-2">
            <span className="at-btn common-black bg-transparent mb-10 rounded-0 p-0">
              <span className="text-uppercase">
                <span className="text-1">Our Team</span>
                <span className="text-2">Our Team</span>
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
          </div>
          <div className="col-lg-7 col-md-7">
            <h2 className="h3" data-reveal="">
              {"Meet the team "}
              <br />
              {" behind every filing"}
            </h2>
          </div>
          <div className="col-lg-3 col-md-5 ms-auto text-center">
            <h2 className="h1 fz-ds-1 fw-500 mb-0 lh-1">
              <span data-count="250" />+
            </h2>
            <h3 className="h6 fw-500 mb-0">
              {"Businesses served "}
              <br />
              {" across three cities."}
            </h3>
          </div>
        </div>
        <div className="row g-4">
          {members.map((m, i) => (
            <div key={m.id} className="col-xxl-4 col-lg-6 col-12">
              <div className="team-card-2">
                <div className="team-card-2__image">
                  <div data-zoomin="">
                    {m.image ? (
                      <img className="img-cover" src={m.image} alt={m.name} />
                    ) : (
                      <div
                        className={`img-cover o-team-initials bg-gradient-to-br ${m.accent || "from-navy-600 to-teal-500"}`}
                        aria-hidden="true"
                      >
                        {m.initials || m.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {m.linkedinUrl && (
                    <div className="team-card-2__social">
                      <a
                        className="team-card-2__social-link"
                        href={m.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} on LinkedIn`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span>Linkedin</span>
                      </a>
                    </div>
                  )}
                </div>
                <div
                  className="team-card-2__content"
                  data-fade="bottom"
                  data-delay={i % 3 === 0 ? ".2" : i % 3 === 1 ? ".5" : ".8"}
                >
                  <span className="team-card-2__name">
                    <h4 className="h6 fz-font-2xl fw-600 m-0">{m.name}</h4>
                  </span>
                  {m.role && (
                    <span className="team-card-2__position">{m.role}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

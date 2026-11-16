/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `/Users/thakurankushsingh/Downloads/orisahtml-410/orisahtml-410/Orisa_v4.1.0_Unzip-First/1.Orisa_HTML_template/index-7.html` (.sec-8-home-7) by scripts/orisa/port-section.py.
// Cards come from Admin → Team (four shown); template people until it has members.
import type { TeamBlockMember } from "./TeamBlock";

/** Template people, shown until Admin → Team has members. */
export const H7_DEFAULT_TEAM: TeamBlockMember[] = [
  {
    id: "t0",
    name: "Darrell Steward",
    role: "UI/UX Designer",
    image: "/orisa/tpl/pages/home-7/team-1-darrell.webp",
    initials: "",
    accent: "",
    linkedinUrl: "",
  },
  {
    id: "t1",
    name: "Amelia Courtney",
    role: "Project Manager",
    image: "/orisa/tpl/pages/home-7/team-2-amelia.webp",
    initials: "",
    accent: "",
    linkedinUrl: "",
  },
  {
    id: "t2",
    name: "Esther Howard",
    role: "Software Developer",
    image: "/orisa/tpl/pages/home-7/team-3-esther.webp",
    initials: "",
    accent: "",
    linkedinUrl: "",
  },
  {
    id: "t3",
    name: "Jacob Jones",
    role: "Marketing CEO",
    image: "/orisa/tpl/pages/home-7/team-4-jacob.webp",
    initials: "",
    accent: "",
    linkedinUrl: "",
  },
];

export function H7Team({
  members = H7_DEFAULT_TEAM,
}: {
  members?: TeamBlockMember[];
}) {
  return (
    <div className="sec-8-home-7 p-relative bg-neutral-0">
      <div className="container-2200 px-lg-5 px-3">
        <div className="row g-0 align-items-start">
          <div className="col-xl-5 col-lg-5 col-12 sec-8-home-7__lead">
            <a
              className="sec-8-home-7__eyebrow d-inline-flex align-items-center gap-2 mb-4 text-uppercase"
              href="/about"
            >
              <span data-scramble-text="Meet Our Team" data-scramble="">
                Meet Our Team
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
            <h2 className="sec-8-home-7__heading mb-40" data-reveal="">
              {" Dedicated Team "}
            </h2>
            <p className="sec-8-home-7__desc mb-40" data-reveal="">
              {
                " Three decades of hands-on compliance expertise — accounts, PF/ESI, inspections and labour-law matters handled by people you can call. "
              }
            </p>
            <div
              className="sec-4-home-7__cta d-inline-flex align-items-stretch mb-60"
              data-fade="bottom"
            >
              <a
                className="at-btn sec-4-home-7__cta-btn text-capitalize"
                href="/about"
              >
                <span>
                  <span className="text-1">Meet the team</span>
                  <span className="text-2">Meet the team</span>
                </span>
              </a>
              <a
                className="sec-4-home-7__cta-circle d-inline-flex align-items-center justify-content-center text-white"
                href="/about"
                aria-label="Meet the team"
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
          </div>
          <div className="col-xl-7 col-lg-7 col-12 mt-5 mt-lg-0">
            <div className="sec-8-home-7__grid">
              {[0, 1].map((col) => (
                <div key={col} className="sec-8-home-7__col">
                  {members
                    .filter((_, i) => i % 2 === col)
                    .map((m) => {
                      const [first, ...rest] = m.name.split(" ");
                      const href = m.linkedinUrl || "/about";
                      const external = /^https?:/.test(href);
                      return (
                        <a
                          key={m.id}
                          className="sec-8-home-7__card"
                          href={href}
                          aria-label={`${m.name} — ${m.role}`}
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          <div className="sec-8-home-7__photo">
                            <div className="fix" data-zoomin="">
                              {m.image ? (
                                <img src={m.image} alt={m.name} />
                              ) : (
                                <div
                                  className={`o-team-initials bg-gradient-to-br ${m.accent || "from-navy-600 to-teal-500"}`}
                                  aria-hidden="true"
                                >
                                  {m.initials ||
                                    m.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="sec-8-home-7__badge">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="15"
                              viewBox="0 0 16 15"
                              fill="none"
                            >
                              <path
                                d="M12.57 3.905L2.74 13.74 1.26 12.26 11.095 2.43 2.29 2.43V0.33L14.42 0.33V12.46H12.32L12.57 3.905Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <div className="sec-8-home-7__info">
                            <h3
                              className="sec-8-home-7__name mb-0"
                              data-fade="bottom"
                            >
                              {first} <br />
                              {rest.join(" ")}
                            </h3>
                            {m.role && (
                              <p
                                className="sec-8-home-7__role mb-0"
                                data-fade="bottom"
                                data-delay="0.1"
                              >
                                {m.role}
                              </p>
                            )}
                          </div>
                        </a>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

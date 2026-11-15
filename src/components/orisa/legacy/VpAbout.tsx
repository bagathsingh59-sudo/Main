/* eslint-disable @next/next/no-img-element */
// Orisa `index-8.html` about block (.sec-3-home-8), content-driven.
export interface VpAboutProps {
  title: string;
  accent: string;
  lead: string;
  tags: string[];
  images: [{ src: string; alt: string }, { src: string; alt: string }];
}

export function VpAbout({ title, accent, lead, tags, images }: VpAboutProps) {
  return (
    <section className="sec-3-home-8">
      <div className="container-fluid sec-3-home-8__container">
        <div className="row align-items-start justify-content-between g-5 g-xxl-0">
          <div className="col-xxl-5 col-md-6 col-lg-6">
            <h2 className="sec-3-home-8__title" data-fade="bottom" data-delay=".1">
              {title} <span className="sec-3-home-8__title-accent">{accent}</span>
            </h2>
            <p className="sec-3-home-8__lead" data-fade="bottom" data-delay=".2">
              {lead}
            </p>
            <div className="sec-3-home-8__tags d-flex flex-wrap" data-fade="bottom" data-delay=".3">
              {tags.map((t) => (
                <span key={t} className="sec-3-home-8__tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="col-xxl-6 col-md-6 col-lg-6">
            <div className="sec-3-home-8__media d-flex justify-content-xxl-end justify-content-lg-center justify-content-start align-items-start">
              <div className="sec-3-home-8__photo sec-3-home-8__photo--narrow" data-fade="right" data-delay=".15">
                <img src={images[0].src} alt={images[0].alt} data-zoomin="" />
              </div>
              <div className="sec-3-home-8__photo sec-3-home-8__photo--wide" data-fade="right" data-delay=".25">
                <img src={images[1].src} alt={images[1].alt} data-zoomin="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

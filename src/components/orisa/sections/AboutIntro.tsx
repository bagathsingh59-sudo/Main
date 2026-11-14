import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "../MotionSection";
import { ArrowUpRight } from "../icons";
import { staticText } from "../text";

/**
 * Orisa index-13 · section 2 — "About us": small intro column with a
 * face stack, big statement, two images with a caption, and a row of
 * four counting stats.
 */
export interface AboutIntroProps {
  label: string;
  /** Wrap one word in *asterisks* to embolden it. */
  intro: string;
  avatars: string[];
  cta: { label: string; href: string };
  pill: string;
  title: string;
  images: [string, string];
  caption: { title: string; text: string };
  stats: { icon: string; tag: string; prefix?: string; count: number; suffix?: string; caption: string }[];
}

export function AboutIntro({ label, intro, avatars, cta, pill, title, images, caption, stats }: AboutIntroProps) {
  return (
    <MotionSection className="sec-2-home-13" aria-label={label}>
      <div className="sec-2-home-13__inner">
        <div className="sec-2-home-13__top">
          <div className="sec-2-home-13__left">
            <div className="sec-2-home-13__label" data-fade="left" data-delay=".05">
              <span className="sec-2-home-13__label-dot" aria-hidden="true" />
              <span className="sec-2-home-13__label-text">{label}</span>
            </div>
            <div className="sec-2-home-13__intro">
              <p className="sec-2-home-13__intro-text" data-fade="bottom">
                {intro.split(/(\*[^*]+\*)/g).map((part, i) =>
                  part.startsWith("*") && part.endsWith("*") ? <strong key={i}>{part.slice(1, -1)}</strong> : part,
                )}
              </p>
              {avatars.length > 0 && (
                <ul className="sec-2-home-13__team">
                  {avatars.map((src, i) => (
                    <li key={src} className="sec-2-home-13__team-avatar" data-fade="left" data-delay={(0.1 * (i + 1)).toFixed(1)}>
                      <Image src={src} alt="" width={96} height={96} />
                    </li>
                  ))}
                </ul>
              )}
              <Link className="sec-2-home-13__cta" href={cta.href} data-fade="bottom">
                <span>{cta.label}</span>
                <ArrowUpRight />
              </Link>
            </div>
          </div>

          <div className="sec-2-home-13__right">
            <div className="sec-2-home-13__head">
              <span className="sec-2-home-13__pill" data-fade="bottom" data-delay=".05">
                <span className="sec-2-home-13__pill-dot" aria-hidden="true" />
                <span>{pill}</span>
              </span>
              <h2 className="sec-2-home-13__title" data-reveal {...staticText(title)} />
            </div>
            <div className="sec-2-home-13__grid">
              <div className="sec-2-home-13__col lg:mr-6">
                <figure className="sec-2-home-13__media">
                  <Image data-zoomin src={images[0]} alt="" width={900} height={700} sizes="(max-width: 991px) 100vw, 33vw" />
                </figure>
                <div className="sec-2-home-13__caption">
                  <h3 className="sec-2-home-13__caption-title" data-chars {...staticText(caption.title)} />
                  <p className="sec-2-home-13__caption-text" data-fade="bottom">
                    {caption.text}
                  </p>
                </div>
              </div>
              <div className="sec-2-home-13__col sec-2-home-13__col--tall lg:ml-6">
                <figure className="sec-2-home-13__media sec-2-home-13__media--tall">
                  <Image data-zoomin src={images[1]} alt="" width={900} height={1200} sizes="(max-width: 991px) 100vw, 33vw" />
                </figure>
              </div>
            </div>
          </div>
        </div>

        <div className="sec-2-home-13__stats">
          {stats.map((s, i) => (
            <div key={s.caption} className="sec-2-home-13__stat" data-fade="left" data-delay={(0.1 + i * 0.15).toFixed(2)}>
              <div className="sec-2-home-13__stat-head">
                <span className="sec-2-home-13__stat-icon">
                  <Image className="dark-mode-invert" src={s.icon} alt="" width={48} height={48} />
                </span>
                <span className="sec-2-home-13__stat-tag">{s.tag}</span>
              </div>
              <p className="sec-2-home-13__stat-num">
                {s.prefix}
                <span data-count={s.count} {...staticText(String(s.count))} />
                {s.suffix}
              </p>
              <p className="sec-2-home-13__stat-cap">{s.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

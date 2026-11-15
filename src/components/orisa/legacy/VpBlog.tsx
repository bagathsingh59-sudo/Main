/* eslint-disable @next/next/no-img-element */
// Orisa block reused by `index-8.html` (.home-5-section-8): three latest articles.
// The first post is the large overlay card, the next two are plain cards.
import Link from "next/link";
import { BtnArrows, CircleArrow } from "./vpIcons";

export interface VpBlogPost {
  title: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  href: string;
  image: string;
}

export interface VpBlogProps {
  label: string;
  title: [string, string];
  viewAll: { label: string; href: string };
  posts: VpBlogPost[];
}

export function VpBlog({ label, title, viewAll, posts }: VpBlogProps) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  return (
    <div className="home-5-section-8 bg-cover pt-100 pb-120">
      <div className="container">
        <div className="row align-items-end mb-50 g-4">
          <div className="col-xxl-1 align-self-start m-0">
            <span className="at-btn common-black bg-transparent mb-10 rounded-0 p-0 mt-10">
              <span className="text-uppercase">
                <span className="text-1">{label}</span>
                <span className="text-2">{label}</span>
              </span>
              <BtnArrows />
            </span>
          </div>
          <div className="col-lg-6 mt-0">
            <h2 className="alt-section-title lh-1 neutral-900 fw-700 mb-0">
              {title[0]}
              <br />
              {title[1]}
            </h2>
          </div>
          <div className="col-xxl-2 col-md-4 ms-lg-auto d-flex justify-content-lg-end">
            <div className="at-btn-group" data-fade="bottom" data-delay=".4">
              <Link className="at-btn-circle" href={viewAll.href} tabIndex={-1} aria-hidden="true">
                <CircleArrow />
              </Link>
              <Link className="at-btn z-index-1" href={viewAll.href}>
                {viewAll.label}
              </Link>
              <Link className="at-btn-circle" href={viewAll.href} tabIndex={-1} aria-hidden="true">
                <CircleArrow />
              </Link>
            </div>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-lg-4 col-12">
            <div className="alt-portfolio-item mb-30 at-hover-item">
              <Link className="alt-portfolio-thumb rounded-0 mb-15 p-relative fix d-block" href={lead.href}>
                <img className="w-100 scale-img-from-to" data-value-1="1.5" data-value-2="1" src={lead.image} alt="" />
                <div className="alt-portfolio-btn start-0 end-0 mx-4">
                  <div className="content">
                    {lead.category && (
                      <span className="bg-transparent text-uppercase border px-3 py-1 rounded-pill text-white fz-font-label">{lead.category}</span>
                    )}
                    <h3 className="h4 fw-600 text-white mb-0 mt-20">{lead.title}</h3>
                    {lead.excerpt && <p className="text-white fz-font-lg mb-0 mt-10 text-truncate-3 des">{lead.excerpt}</p>}
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {rest.slice(0, 2).map((p) => (
            <div key={p.href + p.title} className="col-lg-4 col-12">
              <div>
                <div className="blog-card__thumb rounded-0 hover-effect-1">
                  <Link className="blog-card__img-link" href={p.href} tabIndex={-1} aria-hidden="true">
                    <span data-zoomin="">
                      <img className="blog-card__img" src={p.image} alt="" />
                    </span>
                  </Link>
                </div>
                <div className="blog-card__content mt-30">
                  <h3 className="h5 blog-card__title">
                    <Link className="blog-card__title-link" href={p.href}>
                      {p.title}
                    </Link>
                  </h3>
                  <p className="blog-card__meta">
                    {p.author && (
                      <>
                        <span className="blog-card__meta-text">{"By "}</span>
                        <span className="blog-card__author">{p.author}</span>
                      </>
                    )}
                    {p.date && <span className="blog-card__meta-text">{`${p.author ? " – " : ""}${p.date}`}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
// Ported from Orisa `about-1.html` (.home-3-section-11) by scripts/orisa/port-section.py.
// Cards come from Admin → Blog (published posts); the defaults below show when it is empty.
import Link from "next/link";

export interface BlogBlockPost {
  title: string;
  category: string;
  author: string;
  date: string;
  href: string;
  image: string;
}

/** Template images used for posts without a cover image. */
export const BLOG_FALLBACK_IMAGES = ["/orisa/tpl/pages/img-71.webp", "/orisa/tpl/pages/img-72.webp", "/orisa/tpl/pages/img-73.webp", "/orisa/tpl/pages/img-51.webp", "/orisa/tpl/pages/img-52.webp", "/orisa/tpl/pages/img-53.webp"];

export const DEFAULT_POSTS: BlogBlockPost[] = [
  {
    "category": "Payroll",
    "title": "The 2026 Payroll Compliance Checklist for Indian Businesses",
    "author": "Vaishnavi desk",
    "date": "May 2026",
    "href": "/insights",
    "image": "/orisa/tpl/pages/img-71.webp"
  },
  {
    "category": "GST",
    "title": "Reading GSTR-2B vs 2A: The Reconciliation Mistakes Costing You ITC",
    "author": "Vaishnavi desk",
    "date": "Apr 2026",
    "href": "/insights",
    "image": "/orisa/tpl/pages/img-72.webp"
  },
  {
    "category": "Income Tax",
    "title": "Section 43B(h) MSME Payments: A Complete Implementation Guide",
    "author": "Vaishnavi desk",
    "date": "Apr 2026",
    "href": "/insights",
    "image": "/orisa/tpl/pages/img-73.webp"
  },
  {
    "category": "Labour Law",
    "title": "Wage Code 2025: What Changes for Payroll, PF, and Gratuity",
    "author": "Vaishnavi desk",
    "date": "Mar 2026",
    "href": "/insights",
    "image": "/orisa/tpl/pages/img-51.webp"
  },
  {
    "category": "CFO",
    "title": "Building a Fund-Raise Ready Data Room in 21 Days",
    "author": "Vaishnavi desk",
    "date": "Mar 2026",
    "href": "/insights",
    "image": "/orisa/tpl/pages/img-52.webp"
  },
  {
    "category": "RegTech",
    "title": "When to Replace Your Compliance Spreadsheet with a Platform",
    "author": "Vaishnavi desk",
    "date": "Feb 2026",
    "href": "/insights",
    "image": "/orisa/tpl/pages/img-53.webp"
  }
];

export function BlogBlock({ posts = DEFAULT_POSTS }: { posts?: BlogBlockPost[] }) {
  return (
    <div className="home-3-section-11 overflow-hidden pb-100">
      <div className="container section-fix pt-100">
        <div className="row g-4 section-title-pin">
          <div className="col-xxl-6 col-lg-5 h-100">
            <span className="at-btn common-black text-uppercase bg-transparent mb-10 rounded-0 p-0">
              <span className="text-uppercase">
                <span className="text-1">
                  Compliance desk
                </span>
                <span className="text-2">
                  Compliance desk
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
            <h3 className="fz-ds-1 mb-30 fw-500 lh-1" data-reveal="">
              Briefings from our consultants
            </h3>
            <a className="at-btn" href="/insights">
              <span>
                <span className="text-1">
                  ALL ARTICLES
                </span>
                <span className="text-2">
                  ALL ARTICLES
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
          <div className="col-xxl-6 col-lg-7 p-relative">
            <div className="scroll-section vertical-section section">
              <div className="wrapper">
                <div className="list" role="list">
                  {posts.map((p) => (
                    <div key={p.href + p.title} className="item">
                      <article className="blog-card-2 bg-neutral-0 py-5">
                        <div className="blog-card-2__left flex-grow-1">
                          {p.category && <span className="blog-card-2__category">{p.category}</span>}
                          <h4 className="h6 blog-card-2__title">
                            <Link className="blog-card-2__title-link" href={p.href}>
                              {p.title}
                            </Link>
                          </h4>
                          <p className="blog-card-2__meta">
                            {p.author && (
                              <>
                                <span className="blog-card-2__meta-text">{"By "}</span>
                                <span className="blog-card-2__author">{p.author}</span>
                              </>
                            )}
                            {p.date && <span className="blog-card-2__meta-text">{`${p.author ? " – " : ""}${p.date}`}</span>}
                          </p>
                        </div>
                        <div className="blog-card-2__thumb hover-effect-1">
                          <Link className="blog-card-2__img-link" href={p.href} tabIndex={-1} aria-hidden="true">
                            <img className="blog-card-2__img" src={p.image} alt="" />
                          </Link>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

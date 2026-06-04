"use client";

import Link from "next/link";
import { COMPANY } from "@/constants/company";
import { FOOTER_NAV } from "@/constants/nav";
import { LogoMark3D } from "@/components/three/LogoMark3D";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100/70" id="site-footer">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-5 max-w-sm text-[0.92rem] leading-[1.75] text-navy-100/55">
              {COMPANY.description}
            </p>
            {(COMPANY.registration.icai || COMPANY.registration.iso) && (
              <div className="mt-7 flex flex-wrap items-center gap-4 text-[0.82rem] text-navy-100/55">
                {COMPANY.registration.icai && <span>{COMPANY.registration.icai}</span>}
                {COMPANY.registration.icai && COMPANY.registration.iso && (
                  <span className="h-1 w-1 rounded-full bg-navy-100/30" />
                )}
                {COMPANY.registration.iso && <span>{COMPANY.registration.iso}</span>}
              </div>
            )}
          </div>

          {Object.entries(FOOTER_NAV).map(([heading, links]) => (
            <div key={heading}>
              <h5 className="mb-5 text-[0.85rem] font-bold tracking-wide text-white">{heading}</h5>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.85rem] text-navy-100/55 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-7 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <LogoMark3D />
            <div className="text-[0.78rem] text-navy-100/45">
              © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-navy-100/45">
            {COMPANY.registration.cin && (
              <>
                <span>{COMPANY.registration.cin}</span>
                <span className="hidden md:inline-block h-1 w-1 rounded-full bg-navy-100/30" />
              </>
            )}
            <a href={`mailto:${COMPANY.contact.email}`} className="hover:text-white transition-colors">
              {COMPANY.contact.email}
            </a>
            <span className="hidden md:inline-block h-1 w-1 rounded-full bg-navy-100/30" />
            <a href={`tel:${COMPANY.contact.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
              {COMPANY.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface LegalStubProps {
  title: string;
  intro: string;
  effectiveDate?: string;
  sections?: { heading: string; body: string }[];
}

/**
 * Reusable shell for legal pages (Privacy, Terms, Cookies, Disclaimer).
 *
 * Each page ships with realistic intent-language so it does not look like a
 * dead "Coming Soon" page to Google, but every page carries a visible "Living
 * document" notice — we will replace the body the moment legal review hands
 * over the final text.
 */
export function LegalStub({ title, intro, effectiveDate, sections }: LegalStubProps) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-mist pt-32 pb-24 sm:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-navy-200/45 blur-3xl"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-light opacity-30 [background-size:48px_48px] mask-radial" />

      <Container size="md">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] text-navy-900/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-900">Home</Link>
          <span className="text-navy-900/30">/</span>
          <span className="font-semibold text-navy-900">{title}</span>
        </nav>

        <Badge tone="brand">Legal</Badge>
        <h1 className="mt-5 font-display text-display-lg text-navy-900 text-balance">{title}</h1>
        {effectiveDate && (
          <p className="mt-3 text-[0.82rem] font-medium text-navy-900/55">
            Effective from {effectiveDate}
          </p>
        )}
        <p className="mt-6 text-[1rem] leading-[1.85] text-navy-900/65">{intro}</p>

        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-[0.85rem] text-amber-800">
          <strong>Living document.</strong> This page is being finalised in consultation with our
          legal advisors. The principles below reflect how we operate today. Final wording will be
          published shortly — please reach out to{" "}
          <a href="mailto:info@vaishnaviconsultant.com" className="underline">
            info@vaishnaviconsultant.com
          </a>{" "}
          for any clarification in the meantime.
        </div>

        {sections && sections.length > 0 && (
          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-[1.4rem] text-navy-900">{s.heading}</h2>
                <p className="mt-3 text-[0.95rem] leading-[1.8] text-navy-900/70">{s.body}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Button href="/contact">Contact us</Button>
          <Button href="/" variant="outline">Back to home</Button>
        </div>
      </Container>
    </section>
  );
}

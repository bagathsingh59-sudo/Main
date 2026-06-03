import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-mist px-6 text-center">
      <div className="max-w-md">
        <div className="text-[0.78rem] font-bold uppercase tracking-[0.22em] text-teal-600">404</div>
        <h1 className="mt-4 font-display text-display-lg text-navy-900">Page not found.</h1>
        <p className="mt-4 text-[0.95rem] leading-[1.7] text-navy-900/65">
          The page you were looking for has been moved or never existed. Let's get you back to safe ground.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/">Back to home</Button>
          <Link href="/#contact" className="text-[0.92rem] font-semibold text-navy-600 hover:underline">
            Contact us →
          </Link>
        </div>
      </div>
    </main>
  );
}

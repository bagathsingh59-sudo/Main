# Vaishnavi Consultants — Web

Premium 3D scroll-driven website for **Vaishnavi Consultants**, a Tax & Compliance consulting firm specializing in EPF, ESI, Payroll, Labour Law, Statutory Filings, and Tax Advisory.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript (strict)
- **Styling**: Tailwind CSS with a custom design system (navy / teal / glass)
- **3D**: Three.js via React Three Fiber + drei
- **Animation**: GSAP (ScrollTrigger) + Framer Motion
- **Smooth Scroll**: Lenis
- **Validation**: Zod

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                Next.js App Router entry, layouts, API routes, sitemap/robots
├── components/
│   ├── ui/             Reusable design-system primitives (Button, Card, Container…)
│   ├── three/          R3F scene components (Shield, Particles, FloatingDocs…)
│   └── shared/         Cross-page widgets (Navbar, Footer, ScrollProvider…)
├── sections/           Page sections — one file per landing section
├── layouts/            Page-level layout shells
├── animations/         Framer variants + GSAP timeline factories
├── hooks/              Custom React hooks
├── utils/              Pure helpers (cn, format, seo)
├── constants/          Content data (services, testimonials, FAQs, team…)
├── services/           API clients / form submission
├── types/              Shared TypeScript types
└── assets/             Static media (also see /public)
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run built site |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check, no emit |

## Design Tokens

See `tailwind.config.ts`. Core palette:

- `navy.900` `#0b1f3a` — primary text / dark sections
- `navy.600` `#1a56db` — brand blue, CTAs
- `teal.600` `#0891b2` — accent, secondary brand
- `cloud` `#f5f8ff` — section backgrounds
- `mist` `#eef2ff` — page background

## 3D Storytelling

The hero-to-footer experience is driven by a single sticky **Compliance Shield** scene
(`src/components/three/ComplianceShield.tsx`) whose state is fed by a Lenis-synced GSAP
ScrollTrigger. The shield evolves across 5 phases and morphs into the company logo at the footer.

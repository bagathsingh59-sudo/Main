"use client";

import dynamic from "next/dynamic";

const ComplianceShield = dynamic(
  () => import("@/components/three/ComplianceShield").then((m) => m.ComplianceShield),
  { ssr: false, loading: () => <div style={{ height: "560vh" }} aria-hidden="true" /> },
);

export function ShieldStory() {
  return <ComplianceShield />;
}

import * as THREE from "three";

interface CardSpec {
  label: string;
  sublabel: string;
  badge: string;
  gradient: [string, string];
  icon: "passbook" | "med" | "receipt" | "doc" | "city" | "rupee";
}

export const COMPLIANCE_CARDS: CardSpec[] = [
  { label: "EPF", sublabel: "Provident Fund", badge: "ECR · Filed", gradient: ["#3a64f5", "#1a56db"], icon: "passbook" },
  { label: "ESI", sublabel: "State Insurance", badge: "Returns · 100%", gradient: ["#22d3ee", "#0891b2"], icon: "med" },
  { label: "GST", sublabel: "GSTR 1 · 3B · 9", badge: "Reconciled", gradient: ["#a855f7", "#7c3aed"], icon: "receipt" },
  { label: "TDS", sublabel: "24Q · 26Q · 27Q", badge: "Form 16 · Ready", gradient: ["#10b981", "#059669"], icon: "doc" },
  { label: "PT", sublabel: "Professional Tax", badge: "Multi-state", gradient: ["#fbbf24", "#f59e0b"], icon: "city" },
  { label: "₹", sublabel: "Zero Penalty", badge: "Guaranteed", gradient: ["#06b6d4", "#3a64f5"], icon: "rupee" },
];

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawIcon(ctx: CanvasRenderingContext2D, icon: CardSpec["icon"], cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  switch (icon) {
    case "passbook":
      ctx.strokeRect(-26, -22, 52, 44);
      ctx.beginPath();
      ctx.moveTo(-26, -10);
      ctx.lineTo(26, -10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-18, 4);
      ctx.lineTo(18, 4);
      ctx.moveTo(-18, 14);
      ctx.lineTo(6, 14);
      ctx.stroke();
      break;
    case "med":
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 12);
      ctx.stroke();
      break;
    case "receipt":
      ctx.beginPath();
      ctx.moveTo(-22, -24);
      ctx.lineTo(22, -24);
      ctx.lineTo(22, 24);
      ctx.lineTo(14, 18);
      ctx.lineTo(6, 24);
      ctx.lineTo(-2, 18);
      ctx.lineTo(-10, 24);
      ctx.lineTo(-22, 18);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-14, -10);
      ctx.lineTo(14, -10);
      ctx.moveTo(-14, 2);
      ctx.lineTo(14, 2);
      ctx.stroke();
      break;
    case "doc":
      ctx.beginPath();
      ctx.moveTo(-20, -26);
      ctx.lineTo(12, -26);
      ctx.lineTo(22, -16);
      ctx.lineTo(22, 26);
      ctx.lineTo(-20, 26);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(12, -26);
      ctx.lineTo(12, -16);
      ctx.lineTo(22, -16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, -2);
      ctx.lineTo(14, -2);
      ctx.moveTo(-12, 10);
      ctx.lineTo(8, 10);
      ctx.stroke();
      break;
    case "city":
      ctx.fillRect(-22, -6, 12, 28);
      ctx.fillRect(-6, -18, 12, 40);
      ctx.fillRect(10, -2, 12, 24);
      break;
    case "rupee":
      ctx.font = "900 64px system-ui, -apple-system, 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("₹", 0, 4);
      break;
  }
  ctx.restore();
}

export function makeCardTexture(spec: CardSpec): THREE.CanvasTexture {
  const w = 256;
  const h = 340;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, spec.gradient[0]);
  grad.addColorStop(1, spec.gradient[1]);
  ctx.fillStyle = grad;
  roundedRect(ctx, 0, 0, w, h, 28);
  ctx.fill();

  // Border highlight
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 1, 1, w - 2, h - 2, 27);
  ctx.stroke();

  // Top sheen
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  roundedRect(ctx, 0, 0, w, 110, 28);
  ctx.fill();

  // Status pill
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  roundedRect(ctx, 18, 18, 96, 26, 13);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 12px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("ACTIVE", 30, 31);
  // green dot
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(102, 31, 4, 0, Math.PI * 2);
  ctx.fill();

  // Brand tag (top-right)
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "700 11px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("VAISHNAVI", w - 18, 33);

  // Icon
  drawIcon(ctx, spec.icon, w / 2, 130);

  // Big label
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 56px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(spec.label, w / 2, 210);

  // Sublabel
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "600 14px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(spec.sublabel, w / 2, 248);

  // Bottom divider
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 280);
  ctx.lineTo(w - 20, 280);
  ctx.stroke();

  // Badge
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 12px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(spec.badge, w / 2, 305);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeShieldTexture(): THREE.CanvasTexture {
  const w = 360;
  const h = 360;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Card background — glass white
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "rgba(255,255,255,0.96)");
  bg.addColorStop(1, "rgba(232,240,255,0.92)");
  ctx.fillStyle = bg;
  roundedRect(ctx, 0, 0, w, h, 36);
  ctx.fill();

  // Border
  ctx.strokeStyle = "rgba(11,31,58,0.08)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 1, 1, w - 2, h - 2, 35);
  ctx.stroke();

  // Top brand bar
  ctx.fillStyle = "#0b1f3a";
  ctx.font = "700 13px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("VAISHNAVI CONSULTANT", 28, 36);

  ctx.fillStyle = "#0891b2";
  ctx.textAlign = "right";
  ctx.font = "700 11px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("KALABURAGI · KARNATAKA", w - 28, 36);

  // Divider
  ctx.strokeStyle = "rgba(11,31,58,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 60);
  ctx.lineTo(w - 28, 60);
  ctx.stroke();

  // Big shield in center
  const cx = w / 2;
  const cy = 175;
  const shieldGrad = ctx.createLinearGradient(0, cy - 70, 0, cy + 70);
  shieldGrad.addColorStop(0, "#3a64f5");
  shieldGrad.addColorStop(1, "#0891b2");
  ctx.fillStyle = shieldGrad;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 70);
  ctx.lineTo(cx + 56, cy - 50);
  ctx.lineTo(cx + 56, cy + 10);
  ctx.bezierCurveTo(cx + 56, cy + 50, cx + 28, cy + 70, cx, cy + 76);
  ctx.bezierCurveTo(cx - 28, cy + 70, cx - 56, cy + 50, cx - 56, cy + 10);
  ctx.lineTo(cx - 56, cy - 50);
  ctx.closePath();
  ctx.fill();

  // Checkmark
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy + 4);
  ctx.lineTo(cx - 4, cy + 22);
  ctx.lineTo(cx + 26, cy - 14);
  ctx.stroke();

  // Title
  ctx.fillStyle = "#0b1f3a";
  ctx.font = "900 22px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ZERO-PENALTY", cx, 282);
  ctx.font = "900 22px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("COMPLIANCE SHIELD", cx, 308);

  // Footer stat pill
  ctx.fillStyle = "rgba(8,145,178,0.12)";
  roundedRect(ctx, 90, 326, 180, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#0891b2";
  ctx.font = "700 11px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("250+ businesses · 25+ years", cx, 337);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

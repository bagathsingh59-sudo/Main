import { getSiteSettings } from "@/services/settings";

const TONE_BG: Record<"info" | "warning" | "success", string> = {
  info: "bg-navy-600",
  warning: "bg-amber-500",
  success: "bg-emerald-600",
};

/**
 * Sitewide announcement strip rendered at the very top of every page.
 * Fully driven by Edge Config so admin can toggle without a deploy.
 * Renders nothing when banner.enabled is false or message is empty.
 */
export async function SiteBanner() {
  const { banner } = await getSiteSettings();
  if (!banner.enabled || !banner.message.trim()) return null;

  const bg = TONE_BG[banner.tone] ?? TONE_BG.info;

  return (
    <div className={`${bg} text-white`}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-center text-[0.85rem] font-medium">
        <span>{banner.message}</span>
        {banner.linkUrl && banner.linkLabel && (
          <a href={banner.linkUrl} className="underline decoration-white/60 underline-offset-2 hover:decoration-white">
            {banner.linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}

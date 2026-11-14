import Image from "next/image";
import { MotionSection } from "../MotionSection";

/**
 * Orisa index-13 · section 9 — three columns of images that slide past
 * each other as the page scrolls (outer columns one way, the middle
 * column the other).
 */
export interface GalleryWallProps {
  /** Three columns of image paths. */
  columns: [string[], string[], string[]];
  label?: string;
}

const SHIFT = ["0.12", "-0.1", "0.12"];

export function GalleryWall({ columns, label = "Gallery" }: GalleryWallProps) {
  return (
    <MotionSection className="o-gallery" aria-label={label}>
      <div className="o-gallery__grid">
        {columns.map((images, c) => (
          <div key={c} className="o-gallery__col" data-shift={SHIFT[c]}>
            {images.map((src) => (
              <div key={src} className="o-gallery__item">
                <Image src={src} alt="" width={720} height={540} sizes="34vw" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </MotionSection>
  );
}

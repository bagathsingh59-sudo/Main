/**
 * Props for text that the motion hook rewrites in the DOM (split into
 * characters, scrambled, swapped, counted). Handing it to React as raw
 * HTML keeps React from diffing those nodes later — without this a
 * re-render crashes with "removeChild". The content is escaped and "\n"
 * becomes a line break.
 */
export function staticText(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return { dangerouslySetInnerHTML: { __html: escaped.replace(/\n/g, " <br />") }, suppressHydrationWarning: true };
}

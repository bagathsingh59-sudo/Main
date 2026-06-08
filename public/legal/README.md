# Public legal documents

Files in this directory are served from `/legal/<filename>` and are
publicly accessible to anyone with the URL. Treat that as permanent —
once Google indexes a file here, it lives forever.

## `vaishnavi-license.pdf` — ⚠ NEEDS REDACTION BEFORE GOING LIVE

The original scan of the Karnataka Govt. Form 'C' registration cert
exposes the founder's **personal mobile** (`9845173705`) and
**personal Gmail** (`bhagatsing59@gmail.com`).

Before this file goes live on the public site, redact those two
fields. The registration details (number, dates, address, employee
counts) should remain untouched — they're the trust-signal content
the digital card on the site references.

### How to redact (one-time, ~5 min on macOS)

1. Open `vaishnavi-license.pdf` in **Preview.app**.
2. Tools → Show Markup Toolbar → click the **Redact** icon (rectangle
   with a line through it). On older macOS: Tools → Annotate → Rectangle
   (set fill to black).
3. Drag rectangles over the `Telephone / Mobile No.` cell and the
   `E-Mail` cell on page 1.
4. File → Export As PDF → save over the existing
   `public/legal/vaishnavi-license.pdf` (overwrite).
5. Commit + push. The download button on /about, /contact and
   /disclaimer will serve the redacted version automatically.

### When the cert is renewed next (after 2027)

1. Scan + redact the new certificate (same redaction rules).
2. Replace this PDF.
3. Update `src/constants/license.ts` →
   `lastRenewedOn` and `validUntil` to the new dates.
4. Commit + push.

No code change anywhere else needed — the LicenseCard component reads
from the constants file and the PDF path is stable.

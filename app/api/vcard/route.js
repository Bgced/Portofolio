import { PROFILE } from "@/lib/content";

/**
 * vCard 3.0 file (RFC 6350) yang dibletti di server dan di-cache di edge.
 * Route: /api/vcard — link dari /card (B4).
 */
function escapeVCard(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(PROFILE.fullName)};;;;`,
    `FN:${escapeVCard(PROFILE.fullName)}`,
    "ORG:Portfolio",
    `TITLE:${escapeVCard("Front-End Developer")}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(PROFILE.email)}`,
    `TEL;TYPE=CELL:${escapeVCard(PROFILE.phone)}`,
    `URL:${escapeVCard(PROFILE.portfolio)}`,
    `item1.URL:${escapeVCard(PROFILE.linkedin)}`,
    "END:VCARD",
    "",
  ].join("\r\n");
}

export async function GET() {
  return new Response(buildVCard(), {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cedric-kilian.vcf"',
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
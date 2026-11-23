import { notFound } from "next/navigation";
import { CATALOG, CATALOG_BY_ID } from "@/lib/games";
import PlaySurface from "@/components/playground/PlaySurface";

const SITE_URL = "https://cekael.vercel.app";

export function generateStaticParams() {
  return CATALOG.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = CATALOG_BY_ID[slug];
  if (!item) return { title: "Not found — Cedric Kilian" };
  const title = `${item.title} — Cedric Kilian`;
  const url = `${SITE_URL}/play/${item.id}`;
  return {
    title,
    description: item.desc,
    alternates: { canonical: url },
    openGraph: { title, description: item.desc, type: "website", url },
    twitter: { card: "summary_large_image", title, description: item.desc },
  };
}

export default async function PlayPage({ params }) {
  const { slug } = await params;
  const item = CATALOG_BY_ID[slug];
  if (!item) notFound();
  return <PlaySurface id={item.id} />;
}
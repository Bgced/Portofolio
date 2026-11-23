import { notFound } from "next/navigation";
import { PROJECTS, PROJECTS_BY_SLUG } from "@/lib/projects";
import WorkDetail from "@/components/work/WorkDetail";

const SITE_URL = "https://cekael.vercel.app";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = PROJECTS_BY_SLUG[slug];
  if (!project) return { title: "Not found — Cedric Kilian" };
  const title = `${project.title} — Cedric Kilian`;
  const url = `${SITE_URL}/work/${project.slug}`;
  return {
    title,
    description: project.problem.en,
    alternates: { canonical: url },
    openGraph: { title, description: project.problem.en, type: "article", url },
    twitter: { card: "summary_large_image", title, description: project.problem.en },
  };
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const project = PROJECTS_BY_SLUG[slug];
  if (!project) notFound();
  return <WorkDetail project={project} />;
}
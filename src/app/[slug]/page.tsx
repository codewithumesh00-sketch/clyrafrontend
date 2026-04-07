import { notFound } from "next/navigation";
import WebsiteRenderer from "@/components/renderer/WebsiteRenderer";
import { getWebsiteSchemaBySlug } from "@/lib/schemaStore";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const schema = await getWebsiteSchemaBySlug(slug);

  if (!schema) {
    notFound();
  }

  return <WebsiteRenderer schema={schema} />;
}
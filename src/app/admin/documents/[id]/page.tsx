import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { DocumentStatusPill, PackagePill, StatusPill } from "@/components/ui/Pill";
import { ChevronRightIcon, DocumentIcon, ArrowRightIcon } from "@/components/ui/icons";
import { AdminDocumentReviewPanel } from "@/components/admin/AdminDocumentReviewPanel";
import { formatDate } from "@/lib/utils";
import { getDocumentDetail } from "@/lib/data/admin";

export default async function AdminDocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getDocumentDetail(id);
  if (!detail) notFound();

  const { document, engagement, client } = detail;

  return (
    <div>
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-text-secondary">
        <Link href="/admin/documents" className="hover:text-primary">
          Documents
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="text-text-primary">{engagement?.title ?? "Document"}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium text-text-primary">{engagement?.title ?? "Generated document"}</h1>
          <p className="mt-1 text-text-secondary">{client?.company_name ?? "Unknown client"}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DocumentStatusPill status={document.status} />
            {engagement && <StatusPill status={engagement.status} />}
            {engagement?.package_type && <PackagePill packageType={engagement.package_type} />}
          </div>
        </div>
        {engagement && (
          <Link
            href={`/admin/engagements/${engagement.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
          >
            View engagement
            <ArrowRightIcon className="size-4" />
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardBody className="space-y-5 pt-6">
            <h2 className="font-heading text-xl font-medium text-text-primary">Draft</h2>
            {document.storage_url ? (
              <a
                href={document.storage_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border px-4 py-3.5 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-accent/50 text-primary">
                  <DocumentIcon className="size-5" />
                </span>
                Open the generated PDF
                <ArrowRightIcon className="ml-auto size-4" />
              </a>
            ) : (
              <p className="text-sm text-text-secondary">
                No file is attached to this draft yet — PDF rendering may not be available in this environment. You can still review
                and approve the underlying intake.
              </p>
            )}
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-secondary">Generated</dt>
                <dd className="mt-1 text-sm font-medium text-text-primary">{formatDate(document.generated_at)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-text-secondary">Last reviewed</dt>
                <dd className="mt-1 text-sm font-medium text-text-primary">{formatDate(document.reviewed_at)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4 pt-6">
            <h2 className="font-heading text-xl font-medium text-text-primary">Review</h2>
            <AdminDocumentReviewPanel documentId={document.id} status={document.status} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

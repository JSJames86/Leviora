import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { DocumentStatusPill } from "@/components/ui/Pill";
import { FileCheckIcon, ArrowRightIcon } from "@/components/ui/icons";
import { formatDate } from "@/lib/utils";
import { getDocumentsQueue } from "@/lib/data/admin";

export default async function AdminDocumentsPage() {
  const documents = await getDocumentsQueue();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-text-primary">Documents</h1>
        <p className="mt-1 text-text-secondary">Review generated drafts before they reach your clients.</p>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={<FileCheckIcon className="size-6" />}
          title="No documents yet"
          description="Generated drafts from client questionnaires will land here for review."
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {documents.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/admin/documents/${doc.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/15"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/50 text-primary">
                      <FileCheckIcon className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">{doc.engagementTitle}</p>
                      <p className="text-sm text-text-secondary">{doc.clientName}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <DocumentStatusPill status={doc.status} />
                    <span className="text-xs text-text-secondary">Generated {formatDate(doc.generated_at)}</span>
                    <ArrowRightIcon className="size-4 text-text-secondary" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

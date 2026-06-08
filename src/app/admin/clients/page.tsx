import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PackagePill } from "@/components/ui/Pill";
import { UsersIcon, PlusIcon, ArrowRightIcon } from "@/components/ui/icons";
import { initials, formatDate } from "@/lib/utils";
import { getClientsList } from "@/lib/data/admin";

export default async function AdminClientsPage() {
  const clients = await getClientsList();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium text-text-primary">Clients</h1>
          <p className="mt-1 text-text-secondary">Everyone Leviora is currently working with, in one place.</p>
        </div>
        <Link href="/admin/clients/new">
          <Button size="lg">
            <PlusIcon className="size-4" />
            Invite a client
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="size-6" />}
          title="No clients yet"
          description="Once you invite your first client, they'll show up here with their engagements and contact details."
          action={
            <Link href="/admin/clients/new">
              <Button>Invite a client</Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-border">
            {clients.map((client) => (
              <li key={client.id}>
                <Link
                  href={`/admin/clients/${client.id}`}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/15"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-sm font-medium text-[#3f6f87]">
                      {initials(client.company_name ?? client.user?.full_name)}
                    </span>
                    <div>
                      <p className="font-medium text-text-primary">{client.company_name ?? "Unnamed company"}</p>
                      <p className="text-sm text-text-secondary">{client.user?.full_name ?? client.user?.email ?? "No linked user"}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-text-secondary">
                      {client.engagements.length} engagement{client.engagements.length === 1 ? "" : "s"}
                    </span>
                    {client.engagements[0]?.package_type && <PackagePill packageType={client.engagements[0].package_type} />}
                    <span className="text-xs text-text-secondary">Joined {formatDate(client.created_at)}</span>
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

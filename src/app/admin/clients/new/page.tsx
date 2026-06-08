import { AdminInviteWizard } from "@/components/admin/AdminInviteWizard";

export default function AdminNewClientPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-text-primary">Invite a client</h1>
        <p className="mt-1 text-text-secondary">Set up their account, package, and first engagements in a few steps.</p>
      </div>
      <AdminInviteWizard />
    </div>
  );
}

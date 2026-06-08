import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/portal/onboarding/OnboardingWizard";
import { getCurrentClient, getCurrentUser } from "@/lib/data/users";
import { getOnboardingStatus } from "@/lib/data/engagements";
import { SERVICE_DEFINITIONS } from "@/types";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  const client = await getCurrentClient();
  if (!user || !client) redirect("/login");

  const { needsOnboarding, engagement } = await getOnboardingStatus(client.id);
  if (!needsOnboarding || !engagement) redirect("/portal");

  const serviceLabel = engagement.title.split("—")[0]?.trim() ?? "";
  const service = SERVICE_DEFINITIONS.find((s) => s.label === serviceLabel) ?? SERVICE_DEFINITIONS[0];

  return (
    <OnboardingWizard
      clientId={client.id}
      engagementId={engagement.id}
      engagementTitle={engagement.title}
      packageType={engagement.package_type}
      serviceType={service.key}
      serviceLabel={service.label}
      questionnaireFields={service.fields}
      intakeEmail={client.intake_email ?? ""}
      initialContactInfo={{
        fullName: user.full_name ?? "",
        companyName: client.company_name ?? "",
        phone: client.phone ?? "",
        email: user.email,
      }}
    />
  );
}

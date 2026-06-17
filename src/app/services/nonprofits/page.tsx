import type { Metadata } from "next";
import NonprofitServicesPage from "@/components/nonprofits/NonprofitServicesPage";

export const metadata: Metadata = {
  title: "Nonprofit Services — Leviora Ventures",
  description:
    "Grant writing, research & evaluation, strategic consulting, and technical writing for nonprofits and mission-driven organizations — backed by real artifacts from a funded nonprofit.",
};

export default function Page() {
  return <NonprofitServicesPage />;
}

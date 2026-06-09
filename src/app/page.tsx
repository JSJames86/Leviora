import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Leviora Ventures — Business Consulting",
  description:
    "Strategic advisory and execution support for growing businesses. Track engagements, milestones, and deliverables through your dedicated client portal.",
};

export default function HomePage() {
  return <LandingPage />;
}

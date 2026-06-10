import type { Metadata } from "next";
import IntakeForm from "@/components/intake/IntakeForm";

export const metadata: Metadata = {
  title: "Get Started — Leviora Ventures",
  description: "Tell us about your business so we can confirm your quote and get started.",
};

export default function IntakePage() {
  return <IntakeForm />;
}

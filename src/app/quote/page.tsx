import type { Metadata } from "next";
import QuoteBuilder from "@/components/quote/QuoteBuilder";

export const metadata: Metadata = {
  title: "Get a Quote — Leviora Ventures",
  description: "Build a custom quote for business formation, compliance, websites, and advisory services.",
};

export default function QuotePage() {
  return <QuoteBuilder />;
}

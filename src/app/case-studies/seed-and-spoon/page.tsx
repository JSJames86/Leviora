import type { Metadata } from "next";
import SeedAndSpoonCaseStudy from "@/components/case-studies/SeedAndSpoonCaseStudy";

export const metadata: Metadata = {
  title: "Case Study — Seed & Spoon | Leviora Ventures",
  description:
    "How Leviora built a food-security nonprofit's entire engineering and program infrastructure in-house — an estimated $250K+ in replacement value, delivered without a software budget.",
};

export default function Page() {
  return <SeedAndSpoonCaseStudy />;
}

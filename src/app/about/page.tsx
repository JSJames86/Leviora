import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About — Leviora Ventures",
  description:
    "Janelle Glanville's story — engineer, operator, and founder of Leviora Ventures, Seed & Spoon, and SpoonAssist.",
};

export default function Page() {
  return <AboutPage />;
}

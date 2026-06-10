"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(solid);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  return (
    <motion.header
      animate={{ backgroundColor: scrolled ? "rgba(240,249,255,0.93)" : "rgba(0,0,0,0)" }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
      style={{ borderBottom: scrolled ? "1px solid rgba(100,170,220,0.18)" : "1px solid transparent" }}
    >
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: solid ? 0 : 0.4, duration: 0.8 }}
        >
          <Link
            href="/"
            className="font-heading text-sm tracking-[0.18em] uppercase"
            style={{ color: scrolled ? "#1a3347" : "rgba(255,255,255,0.9)" }}
          >
            Leviora Ventures
          </Link>
        </motion.div>
        <div className="flex items-center gap-3">
          <Link
            href="/about"
            className="text-xs font-medium tracking-wider uppercase transition-opacity hover:opacity-70"
            style={{ color: scrolled ? "#1a3347" : "rgba(255,255,255,0.85)" }}
          >
            About
          </Link>
          <Link
            href="/quote"
            className="text-xs font-medium tracking-wider uppercase transition-colors px-4 py-1.5 rounded-full border"
            style={{
              color: scrolled ? "#f0f8fd" : "#1a3347",
              borderColor: scrolled ? "#1a3347" : "rgba(255,255,255,0.9)",
              backgroundColor: scrolled ? "#1a3347" : "rgba(255,255,255,0.9)",
            }}
          >
            Get a Quote
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium tracking-wider uppercase transition-colors px-4 py-1.5 rounded-full border"
            style={{
              color: scrolled ? "#1a3347" : "rgba(255,255,255,0.85)",
              borderColor: scrolled ? "rgba(26,51,71,0.25)" : "rgba(255,255,255,0.35)",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

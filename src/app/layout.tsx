import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEUROPLAY · Anatomy feasibility lab",
  description: "Phase 0 experiment: inspect a shared-coordinate human brain atlas and its hippocampi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

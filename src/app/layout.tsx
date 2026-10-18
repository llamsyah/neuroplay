import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEUROPLAY — Memahami pikiran. Menjelajahi otak.",
  description: "Temukan hubungan antara pengalaman manusia dan mekanisme otak melalui eksplorasi 3D, pertanyaan, dan eksperimen interaktif.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" data-scroll-behavior="smooth"><body>{children}</body></html>;
}

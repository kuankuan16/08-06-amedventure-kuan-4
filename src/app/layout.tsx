import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMED Ventures — Funding MedTech Innovations That Matter",
  description: "Strategic capital and global expertise for breakthrough medical-device founders across the US and Asia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

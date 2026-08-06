/* eslint-disable @next/next/no-page-custom-font -- external brand fonts are loaded once in the root App Router layout */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMED Ventures — Funding MedTech Innovations That Matter",
  description: "Strategic capital and global expertise for breakthrough medical-device founders across the US and Asia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500&amp;display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400&amp;display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}

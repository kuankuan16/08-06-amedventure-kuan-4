import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Companies — AMED Ventures",
  description: "Explore AMED Ventures' selected MedTech investments across cardiovascular, neurovascular, embolization, surgical innovation and digital health.",
};

export default function CompaniesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

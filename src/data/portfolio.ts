// Shared portfolio content from AMED's website brief, used by both website proposals.

export type Filter = "All" | "Cardiovascular" | "Neurovascular" | "Embolization" | "Surgical" | "Vision Care" | "Diagnostics" | "Digital Health" | "Manufacturing";

export type Company = {
  name: string;
  description: string;
  focus: Exclude<Filter, "All">[];
  href: string;
  location: string;
  founded: string;
  /** Official logo fetched from the company's own site by scripts/fetch-company-logos.mjs. */
  logo?: string;
};

export const filters: Filter[] = ["All", "Cardiovascular", "Neurovascular", "Embolization", "Surgical", "Vision Care", "Diagnostics", "Digital Health", "Manufacturing"];

export const companies: Company[] = [
  { name: "Adona Medical", description: "Clinical-stage heart-failure company: adjustable interatrial shunting with integrated bi-atrial remote pressure monitoring.", focus: ["Cardiovascular"], href: "https://adonamed.com/", location: "Los Gatos, CA", founded: "2017", logo: "/images/logos/adona-medical.svg" },
  { name: "Akura Medical", description: "Catheter-based technologies treating peripheral arterial disease through minimally invasive vascular intervention.", focus: ["Cardiovascular"], href: "https://www.akuramedical.com/", location: "Los Gatos, CA", founded: "2019", logo: "/images/logos/akura-medical.svg" },
  { name: "Atia Vision", description: "OmniVu, a modular accommodating intraocular lens restoring dynamic range of vision after cataract surgery.", focus: ["Vision Care"], href: "https://atiavision.com/", location: "Campbell, CA", founded: "2014", logo: "/images/logos/atia-vision.svg" },
  { name: "Benthic Genomics", description: "Genomic analysis platform turning complex regions such as HLA and KIR into high-confidence calls from microarray and sequencing data.", focus: ["Diagnostics"], href: "https://www.benthic.bio/", location: "Mountain View, CA", founded: "2018", logo: "/images/logos/benthic-genomics.png" },
  { name: "Dynaflex Technologies", description: "Full-service partner specializing in catheter design, polymer innovation and smart manufacturing equipment.", focus: ["Manufacturing"], href: "https://www.dynaflextech.com/", location: "California & Taiwan", founded: "2016", logo: "/images/logos/dynaflex-technologies.png" },
  { name: "Imperative Care", description: "End-to-end stroke and vascular platform across the continuum of neurovascular disease, including the Telos endovascular robotics platform.", focus: ["Neurovascular"], href: "https://imperativecare.com/", location: "Campbell, CA", founded: "2016", logo: "/images/logos/imperative-care.svg" },
  { name: "Instylla", description: "Next-generation liquid embolics — the Embrace Hydrogel Embolic System — for interventional oncology and peripheral hemostasis.", focus: ["Embolization"], href: "https://instylla.com/", location: "Bedford, MA", founded: "2017", logo: "/images/logos/instylla.svg" },
  { name: "Kandu", description: "Stroke-recovery platform combining the IpsiHand brain-computer interface with AI-supported remote care.", focus: ["Neurovascular", "Digital Health"], href: "https://kandu.com/", location: "Campbell, CA", founded: "2025", logo: "/images/logos/kandu.svg" },
  { name: "KT Medical", description: "Clinical-grade metallic wires and specialized devices, supplying guide wires, wire forms and OEM components worldwide.", focus: ["Manufacturing"], href: "https://ktmedical.co/", location: "Kaohsiung, Taiwan", founded: "2017", logo: "/images/logos/kt-medical.png" },
  { name: "Rejoni", description: "The Juveena Hydrogel System, a bioresorbable hydrogel preventing intrauterine adhesions after gynecologic procedures.", focus: ["Surgical"], href: "https://www.rejoni.com/", location: "Bedford, MA", founded: "2020", logo: "/images/logos/rejoni.png" },
  { name: "Sealonix", description: "Bioresorbable sealant and hemostatic biomaterials improving tissue closure and surgical healing.", focus: ["Surgical"], href: "https://sealonix.com/", location: "Bedford, MA", founded: "2023", logo: "/images/logos/sealonix.png" },
  { name: "Supira Medical", description: "A next-generation 10F percutaneous ventricular assist device for high-risk PCI and cardiogenic shock.", focus: ["Cardiovascular"], href: "https://supiramedical.com/", location: "Los Gatos, CA", founded: "2017", logo: "/images/logos/supira-medical.svg" },
  { name: "Tioga Cardiovascular", description: "Transseptal, low-profile transcatheter valve replacement for mitral and tricuspid disease.", focus: ["Cardiovascular"], href: "https://tiogacardiovascular.com/", location: "Campbell, CA", founded: "2018", logo: "/images/logos/tioga-medical.png" },
  { name: "Tulavi Therapeutics", description: "The allay Hydrogel Cap, an in-situ forming hydrogel protecting transected peripheral nerves and reducing symptomatic neuroma.", focus: ["Surgical"], href: "https://tulavi.com/", location: "Los Gatos, CA", founded: "2018", logo: "/images/logos/tulavi-therapeutics.svg" },
  { name: "Verge Medical", description: "Physician-founded developer of coronary and peripheral vascular technologies, including the commercial-stage FLASH system for aorto-ostial intervention.", focus: ["Cardiovascular"], href: "https://vergemedical.com/", location: "Campbell, CA", founded: "2025", logo: "/images/logos/verge-medical.png" },
  { name: "Wiltrom", description: "Minimally invasive spine implants spanning fixation, interbody fusion, bone-graft substitutes, vertebral augmentation and bone cement.", focus: ["Surgical"], href: "https://www.wiltrom.com.tw/", location: "Zhubei, Taiwan", founded: "2009", logo: "/images/logos/wiltrom.png" },
];

/** Realized investments. AMED has not supplied descriptions for these, so only the names and,
 *  where a first-party mark exists, the company's own logo are shown. Crossfire Medical has no
 *  live website, so no logo file is available for it. */
export const exited: { name: string; logo?: string }[] = [
  { name: "Neuvera", logo: "/images/logos/nuvera-medical.png" },
  { name: "Truvic", logo: "/images/logos/truvic-medical.png" },
  { name: "Crossfire" },
  { name: "LightningCath", logo: "/images/logos/lightningcath.png" },
];

export type Region = "United States" | "Taiwan";
export type Status = "Active" | "Realized";

export const regions: Region[] = ["United States", "Taiwan"];
export const statuses: Status[] = ["Active", "Realized"];
export const sortOptions = ["Recent", "Alphabetical"] as const;
export type SortOption = (typeof sortOptions)[number];

/** A company may operate in both places — "California & Taiwan" belongs to each region. */
export function regionsOf(location: string): Region[] {
  const list: Region[] = [];
  if (/taiwan/i.test(location)) list.push("Taiwan");
  if (!/taiwan/i.test(location) || /california|,\s*[A-Z]{2}$/.test(location)) list.push("United States");
  return list;
}

export type PortfolioEntry = Company & { status: Status };

/** One list for the companies index: active investments first, then realized ones. The realized
 *  entries carry only what AMED has supplied — a name — so their cards show a badge, not a link. */
export const portfolio: PortfolioEntry[] = [
  ...companies.map((company) => ({ ...company, status: "Active" as const })),
  ...exited.map(({ name, logo }) => ({ name, logo, description: "", focus: [], href: "", location: "", founded: "", status: "Realized" as const })),
];

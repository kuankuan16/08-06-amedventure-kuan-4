// Story items from the news links in AMED's website brief.
//
// `title`, `date` and `image` come from each publisher's own page (og:title, article:published_time,
// og:image) — re-run scripts/fetch-news-images.mjs to refresh them rather than hand-editing.
//
// `type` is set by hand, one value per item, by what the headline's main clause reports:
//   Financing  — money in: seed, Series A–E, debt, grants
//   Clinical   — trial started, enrolment complete, results published
//   Regulatory — submission, clearance, approval: 510(k), PMA, CE, De Novo
//   Commercial — first use, launch, purchasing or distribution contract, rebrand, acquisition
// A story that spans two types takes the one its main clause reports; never both, or the counts
// on the filter stop meaning anything.

export type NewsType = "Financing" | "Clinical" | "Regulatory" | "Commercial";

export type PortfolioNews = {
  company: string;
  title: string;
  source: string;
  url: string;
  type: NewsType;
  /** ISO date from the publisher; "" when the page states none. */
  date: string;
  /** The publisher's own og:image, normalised to 1200×750. Absent items fall back to drawn artwork. */
  image?: string;
};

export const newsTypes: NewsType[] = ["Financing", "Clinical", "Regulatory", "Commercial"];

export const portfolioNews: PortfolioNews[] = [
  {
    company: "Imperative Care",
    url: "https://vascularnews.com/imperative-care-initiates-clear-it-clinical-study/",
    title: "Imperative Care initiates CLEAR-IT clinical study",
    source: "vascularnews.com",
    type: "Clinical",
    date: "2026-03-26",
    image: "/images/news/imperative-care-initiates-clear-it-clinical-study.jpg",
  },
  {
    company: "Kandu",
    url: "https://www.prnewswire.com/news-releases/randomized-controlled-trial-demonstrated-positive-outcomes-for-fda-cleared-brain-computer-interface-ipsihand-system-in-chronic-stroke-rehabilitation-302685764.html",
    title: "Randomized Controlled Trial Demonstrated Positive Outcomes for FDA-Cleared Brain-Computer Interface IpsiHand® System in Chronic Stroke Rehabilitation",
    source: "prnewswire.com",
    type: "Clinical",
    date: "2026-02-12",
    image: "/images/news/randomized-controlled-trial-demonstrated-positive-outcomes-f.jpg",
  },
  {
    company: "Instylla",
    url: "https://www.prnewswire.com/news-releases/instylla-initiates-commercial-launch-with-first-use-of-the-embrace-hydrogel-embolic-system-302671903.html",
    title: "Instylla Initiates Commercial Launch with First Use of the Embrace™ Hydrogel Embolic System",
    source: "prnewswire.com",
    type: "Commercial",
    date: "2026-01-28",
    image: "/images/news/instylla-initiates-commercial-launch-with-first-use-of-the-e.jpg",
  },
  {
    company: "Tulavi Therapeutics",
    url: "https://www.prnewswire.com/news-releases/tulavi-therapeutics-receives-innovative-technology-contract-from-vizient-for-the-allay-hydrogel-cap-302659243.html",
    title: "Tulavi Therapeutics Receives Innovative Technology Contract from Vizient for the allay™ Hydrogel Cap",
    source: "prnewswire.com",
    type: "Commercial",
    date: "2026-01-13",
    image: "/images/news/tulavi-therapeutics-receives-innovative-technology-contract-.jpg",
  },
  {
    company: "Instylla",
    url: "https://www.prnewswire.com/news-releases/instylla-completes-submission-of-premarket-approval-application-for-embrace-hydrogel-embolic-system-302397602.html",
    title: "Instylla Completes Submission of Premarket Approval Application for Embrace™ Hydrogel Embolic System",
    source: "prnewswire.com",
    type: "Regulatory",
    date: "2025-03-11",
    image: "/images/news/instylla-completes-submission-of-premarket-approval-applicat.jpg",
  },
  {
    company: "Verge Medical",
    url: "https://www.dicardiology.com/content/ostial-corp-rebrands-verge-medical-acquires-new-technology",
    title: "Ostial Corp. Rebrands as Verge Medical, Acquires New Technology",
    source: "dicardiology.com",
    type: "Commercial",
    date: "2025-03-18",
    image: "/images/news/ostial-corp-rebrands-verge-medical-acquires-new-technology.jpg",
  },
  {
    company: "Adona Medical",
    url: "https://www.prnewswire.com/news-releases/adona-medical-a-shifamed-portfolio-company-raises-33-5-million-in-series-c-financing-302192673.html",
    title: "Adona Medical, a Shifamed Portfolio Company, Raises $33.5 Million in Series C Financing",
    source: "prnewswire.com",
    type: "Financing",
    date: "2024-07-10",
    image: "/images/news/adona-medical-a-shifamed-portfolio-company-raises-33-5-milli.jpg",
  },
  {
    company: "Sealonix",
    url: "https://www.prnewswire.com/news-releases/sealonix-inc-closes-20-million-financing-to-develop-sealant-products-for-abdominopelvic-and-orthopedic-procedures-301822963.html",
    title: "Sealonix, Inc. Closes $20 Million Financing to Develop Sealant Products for Abdominopelvic and Orthopedic Procedures",
    source: "prnewswire.com",
    type: "Financing",
    date: "2023-05-12",
  },
  {
    company: "Akura Medical",
    url: "https://evtoday.com/news/akura-begins-pivotal-trial-of-katana-thrombectomy-system-in-pulmonary-embolism",
    title: "Akura Begins Pivotal Trial of Katana Thrombectomy System in Pulmonary Embolism",
    source: "evtoday.com",
    type: "Clinical",
    date: "",
    image: "/images/news/akura-begins-pivotal-trial-of-katana-thrombectomy-system-in-.jpg",
  },
  {
    company: "Supira Medical",
    url: "https://novoholdings.dk/news/novo-holdings-co-leads-120-million-series-e-financing-of-supira-medical-to-advance-percutaneous-ventricular-assist-device-technology",
    title: "Novo Holdings co-leads $120 million Series E Financing of Supira Medical to Advance Percutaneous Ventricular Assist Device Technology",
    source: "novoholdings.dk",
    type: "Financing",
    date: "",
  },
];

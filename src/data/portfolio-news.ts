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
    company: "Tulavi Therapeutics",
    url: "https://blog.orthoindy.com/2026/06/15/orthoindy-indiana-hand-to-shoulder-center-first-in-indiana-to-use-new-technology-during-combined-amputation-and-peripheral-nerve-procedure/",
    title: "OrthoIndy, Indiana Hand to Shoulder Center First in Indiana to Use New Technology During Combined Amputation and Peripheral Nerve Procedure",
    source: "blog.orthoindy.com",
    type: "Commercial",
    date: "2026-06-15",
  },
  {
    company: "Rejoni",
    url: "https://www.businesswire.com/news/home/20260616503636/en/Rejoni-Inc.-Secures-%2425-Million-in-Financing-to-Accelerate-the-Juveena-Hydrogel-System-Toward-FDA-Approval-and-Launch",
    title: "Rejoni Secures $25 Million to Accelerate the Juveena Hydrogel System Toward FDA Approval and Launch",
    source: "businesswire.com",
    type: "Financing",
    date: "2026-06-16",
  },
  {
    company: "Benthic Genomics",
    url: "https://www.benthic.bio/post/benthic-genomics-adds-mako-to-the-benthic-analysis-platform-for-high-resolution-immune-region-analys",
    title: "Benthic Genomics Adds Mako to the Benthic Analysis Platform for High-Resolution Immune-Region Analysis From Short-Read Sequencing Data",
    source: "benthic.bio",
    type: "Commercial",
    date: "2026-04-15",
  },
  {
    company: "Supira Medical",
    url: "https://www.massdevice.com/supira-fda-nod-ventricular-assist-study/",
    title: "Supira Gets FDA Green Light to Conduct Ventricular Assist Device Study",
    source: "massdevice.com",
    type: "Regulatory",
    date: "2026-04-08",
  },
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
    company: "Rejoni",
    url: "https://www.businesswire.com/news/home/20260113722822/en/FDA-Files-Rejonis-Juveena-Hydrogel-System-PMA-for-the-Prevention-of-Intrauterine-Adhesions",
    title: "FDA Files Rejoni's Juveena Hydrogel System PMA for the Prevention of Intrauterine Adhesions",
    source: "businesswire.com",
    type: "Regulatory",
    date: "2026-01-13",
  },
  {
    company: "Tioga Cardiovascular",
    url: "https://europcr2026.europa-inviteo.com/gws/index.php?langue=en&onglet=33&paramProjet=102151",
    title: "EuroPCR 2026 Presentation",
    source: "europcr2026.europa-inviteo.com",
    type: "Clinical",
    date: "",
  },
  {
    company: "Imperative Care",
    url: "https://finance.yahoo.com/healthcare/articles/imperative-care-launches-ikon-24-201500656.html",
    title: "Imperative Care Launches Ikon 24",
    source: "finance.yahoo.com",
    type: "Commercial",
    date: "",
  },
  {
    company: "Benthic Genomics",
    url: "https://www.benthic.bio/post/anglerlaunch",
    title: "Benthic Genomics Launches Angler Imputation Platform, Making High-Resolution Immunogenomics Accessible to All Researchers",
    source: "benthic.bio",
    type: "Commercial",
    date: "2025-09-10",
  },
  {
    company: "Adona Medical",
    url: "https://www.massdevice.com/adona-completes-enrollment-interatrial-shunt-trial/",
    title: "Adona Medical Completes Enrollment in First-in-Human Interatrial Shunt Trial",
    source: "massdevice.com",
    type: "Clinical",
    date: "2025-06-17",
  },
  {
    company: "Atia Vision",
    url: "https://www.businesswire.com/news/home/20250520015920/en/FDA-Grants-Atia-Vision-Approval-to-Begin-US-Clinical-Trial-of-OmniVu-Lens-System-in-Patients-with-Cataracts",
    title: "FDA Grants Atia Vision Approval to Begin US Clinical Trial of OmniVu Lens System in Patients with Cataracts",
    source: "businesswire.com",
    type: "Regulatory",
    date: "2025-05-20",
  },
  {
    company: "Kandu",
    url: "https://www.massdevice.com/kandu-health-neurolutions-merge-bci-stroke/",
    title: "Kandu Health, Neurolutions Merge Into BCI Company Targeting Stroke Care",
    source: "massdevice.com",
    type: "Commercial",
    date: "2025-04-08",
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
    company: "Rejoni",
    url: "https://www.businesswire.com/news/home/20250204916499/en/Rejoni-completes-patient-enrollment-in-pivotal-clinical-study-of-a-Novel-Treatment-for-the-Prevention-of-Intrauterine-Adhesions-the-Juveena-Hydrogel-System.",
    title: "Rejoni Completes Patient Enrollment in Pivotal Clinical Study of the Juveena Hydrogel System",
    source: "businesswire.com",
    type: "Clinical",
    date: "2025-02-04",
  },
  {
    company: "Tioga Cardiovascular",
    url: "https://www.massdevice.com/shifameds-tioga-cardiovascular-has-first-human-cases-with-mitral-valve-replacement/",
    title: "Tioga Cardiovascular Completes First-in-Human Mitral Valve Replacement Cases",
    source: "massdevice.com",
    type: "Clinical",
    date: "2024-10-23",
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
    company: "Akura Medical",
    url: "https://www.medtechdive.com/news/akura-medical-35m-510k-thrombectomy/695609/",
    title: "Akura Medical Secures $35M to Pursue FDA Clearance for Thrombectomy Device",
    source: "medtechdive.com",
    type: "Financing",
    date: "2023-10-04",
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
    company: "KT Medical",
    url: "https://news.gbimonthly.com/tw/magazine/article_show.php?num=53410",
    title: "康聚醫學科技 全臺唯一醫療級金屬線材廠",
    source: "news.gbimonthly.com",
    type: "Commercial",
    date: "2022-09-30",
  },
  {
    company: "KT Medical",
    url: "https://www.ctee.com.tw/news/20211110701337-439901",
    title: "康聚醫學科技進軍心導管醫材",
    source: "ctee.com.tw",
    type: "Commercial",
    date: "2021-11-09",
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
    company: "Adona Medical",
    url: "https://cardiovascularbusiness.com/topics/clinical/heart-failure/adjustable-interatrial-shunt-heart-failure-shows-promise-first-human-trial",
    title: "Adjustable Interatrial Shunt for Heart Failure Shows Promise in First-in-Human Trial",
    source: "cardiovascularbusiness.com",
    type: "Clinical",
    date: "",
  },
  {
    company: "Akura Medical",
    url: "https://evtoday.com/news/akura-raises-financing-for-thrombectomy-system-and-quantification-software-1",
    title: "Akura Raises Financing for Thrombectomy System and Quantification Software",
    source: "evtoday.com",
    type: "Financing",
    date: "",
  },
  {
    company: "Imperative Care",
    url: "https://www.fiercebiotech.com/medtech/stroke-tech-developer-imperative-care-nets-100m-financing",
    title: "Imperative Care Nets $100M Financing",
    source: "fiercebiotech.com",
    type: "Financing",
    date: "",
  },
  {
    company: "Supira Medical",
    url: "https://novoholdings.dk/news/novo-holdings-co-leads-120-million-series-e-financing-of-supira-medical-to-advance-percutaneous-ventricular-assist-device-technology",
    title: "Novo Holdings co-leads $120 million Series E Financing of Supira Medical to Advance Percutaneous Ventricular Assist Device Technology",
    source: "novoholdings.dk",
    type: "Financing",
    date: "",
  },
  {
    company: "Tulavi Therapeutics",
    url: "https://www.fiercebiotech.com/medtech/fda-clears-surgical-hydrogel-nerve-cap-preventing-phantom-limb-pain-amputees",
    title: "FDA Clears Surgical Hydrogel Nerve Cap for Preventing Phantom Limb Pain",
    source: "fiercebiotech.com",
    type: "Regulatory",
    date: "",
  },
];

// Per-company news links exactly as listed in AMED's website brief. Companies the brief left
// blank ("None", "TBD") are absent here, and their card says so rather than showing nothing.
export const companyNews: Record<string, string[]> = {
  "Adona Medical": [
    "https://cardiovascularbusiness.com/topics/clinical/heart-failure/adjustable-interatrial-shunt-heart-failure-shows-promise-first-human-trial",
    "https://www.massdevice.com/adona-completes-enrollment-interatrial-shunt-trial/",
    "https://www.prnewswire.com/news-releases/adona-medical-a-shifamed-portfolio-company-raises-33-5-million-in-series-c-financing-302192673.html",
  ],
  "Akura Medical": [
    "https://evtoday.com/news/akura-raises-financing-for-thrombectomy-system-and-quantification-software-1",
    "https://www.medtechdive.com/news/akura-medical-35m-510k-thrombectomy/695609/",
    "https://evtoday.com/news/akura-begins-pivotal-trial-of-katana-thrombectomy-system-in-pulmonary-embolism",
  ],
  "Atia Vision": [
    "https://www.businesswire.com/news/home/20250520015920/en/FDA-Grants-Atia-Vision-Approval-to-Begin-US-Clinical-Trial-of-OmniVu-Lens-System-in-Patients-with-Cataracts",
  ],
  "Benthic Genomics": [
    "https://www.benthic.bio/post/anglerlaunch",
    "https://www.benthic.bio/post/benthic-genomics-adds-mako-to-the-benthic-analysis-platform-for-high-resolution-immune-region-analys",
  ],
  "Imperative Care": [
    "https://finance.yahoo.com/healthcare/articles/imperative-care-launches-ikon-24-201500656.html",
    "https://www.fiercebiotech.com/medtech/stroke-tech-developer-imperative-care-nets-100m-financing",
    "https://vascularnews.com/imperative-care-initiates-clear-it-clinical-study/",
  ],
  "Instylla": [
    "https://www.prnewswire.com/news-releases/instylla-initiates-commercial-launch-with-first-use-of-the-embrace-hydrogel-embolic-system-302671903.html",
    "https://www.prnewswire.com/news-releases/instylla-completes-submission-of-premarket-approval-application-for-embrace-hydrogel-embolic-system-302397602.html",
  ],
  "KT Medical": [
    "https://www.ctee.com.tw/news/20211110701337-439901",
    "https://news.gbimonthly.com/tw/magazine/article_show.php?num=53410",
  ],
  "Kandu": [
    "https://www.massdevice.com/kandu-health-neurolutions-merge-bci-stroke/",
    "https://www.prnewswire.com/news-releases/randomized-controlled-trial-demonstrated-positive-outcomes-for-fda-cleared-brain-computer-interface-ipsihand-system-in-chronic-stroke-rehabilitation-302685764.html",
  ],
  "Rejoni": [
    "https://www.businesswire.com/news/home/20260616503636/en/Rejoni-Inc.-Secures-%2425-Million-in-Financing-to-Accelerate-the-Juveena-Hydrogel-System-Toward-FDA-Approval-and-Launch",
    "https://www.businesswire.com/news/home/20260113722822/en/FDA-Files-Rejonis-Juveena-Hydrogel-System-PMA-for-the-Prevention-of-Intrauterine-Adhesions",
    "https://www.businesswire.com/news/home/20250204916499/en/Rejoni-completes-patient-enrollment-in-pivotal-clinical-study-of-a-Novel-Treatment-for-the-Prevention-of-Intrauterine-Adhesions-the-Juveena-Hydrogel-System",
  ],
  "Sealonix": [
    "https://www.prnewswire.com/news-releases/sealonix-inc-closes-20-million-financing-to-develop-sealant-products-for-abdominopelvic-and-orthopedic-procedures-301822963.html",
  ],
  "Supira Medical": [
    "https://www.massdevice.com/supira-fda-nod-ventricular-assist-study/",
    "https://novoholdings.dk/news/novo-holdings-co-leads-120-million-series-e-financing-of-supira-medical-to-advance-percutaneous-ventricular-assist-device-technology",
  ],
  "Tioga Cardiovascular": [
    "https://europcr2026.europa-inviteo.com/gws/index.php?langue=en&onglet=33&paramProjet=102151",
    "https://www.massdevice.com/shifameds-tioga-cardiovascular-has-first-human-cases-with-mitral-valve-replacement/",
  ],
  "Tulavi Therapeutics": [
    "https://blog.orthoindy.com/2026/06/15/orthoindy-indiana-hand-to-shoulder-center-first-in-indiana-to-use-new-technology-during-combined-amputation-and-peripheral-nerve-procedure/",
    "https://www.prnewswire.com/news-releases/tulavi-therapeutics-receives-innovative-technology-contract-from-vizient-for-the-allay-hydrogel-cap-302659243.html",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC12705062/",
    "https://www.fiercebiotech.com/medtech/fda-clears-surgical-hydrogel-nerve-cap-preventing-phantom-limb-pain-amputees",
  ],
  "Verge Medical": [
    "https://www.dicardiology.com/content/ostial-corp-rebrands-verge-medical-acquires-new-technology",
  ],
};

/** The publisher domain, used as the visible label for a link. */
export function newsHost(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}

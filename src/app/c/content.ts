import styles from "./page.module.css";

export const teamEmail = "info@amedventures.com";
export const taipeiOffice = "Taipei, Taiwan";
export const taipeiOfficeDetailed =
  "3F.-1, No. 3, Dunhua S. Rd., Songshan Dist., Taipei City 105, Taiwan (R.O.C.)";
export const usOffice = "San Francisco, USA";
export const teamPortraitFallback = "/images/amed/team-placeholder-02.jpg";
export const teamLinkedIn = "https://www.linkedin.com/";

export const team = [
  ["Managing Partners", [
    ["Michael Wang", "Chairman, Managing Partner", "", "/images/team-client/michael-wang-unified.png"],
    ["William Tai", "Managing Partner", "", "/images/team-client/william-tai-unified.png"],
    ["Joe Liu", "Managing Partner", "", "/images/team-client/joe-liu-unified.png"],
  ]],
  ["Venture Advisors", [
    ["Dr. TJ Liu", "Venture Advisor", "", "/images/team-client/tj-liu-unified.png"],
    ["Dr. Kuan Chen", "Venture Advisor", "", teamPortraitFallback],
    ["Fred Shen", "Venture Advisor", "", "/images/team-client/fred-shen-unified.png"],
  ]],
  ["Investment Team", [
    ["Michelle Tsai", "Senior Investment Manager", "Michelle Tsai is a Senior Investment Manager at AMED Ventures, evaluating opportunities across interventional technologies and the growing intersection of hardware and AI in healthcare. She focuses on first-in-class innovations with strong clinical differentiation and has contributed to investments that attracted global medtech strategics and sovereign fund participation.\n\nPrior to joining AMED, she spent nearly a decade at Zuellig Pharma, a leading healthcare solutions provider in Asia. There, she grew a client base spanning global MNCs and biotech firms, doubling regional revenue through consistent double-digit annual growth.\n\nShe holds an M.S. in Biomedical Engineering from National Taiwan University, a B.S. in Mechanical Engineering from National Chung Hsing University, and a PMP certification — an engineering foundation that complements her commercial acumen in assessing medtech opportunities.", "/images/team-client/michelle-tsai-unified.png"],
    ["Jeremy Tseng, CFA", "Senior Investment Manager", "At AMED Ventures, Jeremy evaluates investment and M&A opportunities across the medical device and MedTech CDMO sectors, and leads post-investment management for a portfolio of companies with a combined market valuation exceeding $2 billion.\n\nPrior to AMED, he drove M&A evaluation and strategic partnerships at Catcher Technology (TWSE: 2474), supporting the company's initiatives across the MedTech, semiconductor, and aerospace industries. Earlier, at Deloitte Financial Advisory, he advised on cross-border M&A and deal structuring.\n\nJeremy holds an M.S. in Finance from the University of Illinois Urbana-Champaign and a B.B.A. in Finance from National Chengchi University, and is a CFA Charterholder.", "/images/team-client/jeremy-tseng-unified.png"],
    ["Bin Chou, Ph.D.", "Investment Manager", "Bin is an engineer-turned-investor, focusing on healthcare innovations including AI diagnostics, next-generation testing platforms, medical devices, and frontier biotech.\n\nHe holds a Ph.D. in Mechanical Engineering from National Taiwan University and an M.S. in Molecular Medicine from National Cheng Kung University, combining engineering and life-science expertise in technical diligence.\n\nBefore investing, Bin spent over 15 years in diagnostics and medical devices, holding senior R&D and executive roles across POCT, IVD development, manufacturing, and global regulatory approvals including FDA, NMPA, and CE.", "/images/team-client/bin-chou-unified.png"],
    ["Jonathan Feng", "Investment Manager", "Jonathan is an Investment Manager at AMED Ventures, evaluating MedTech investments across cardiovascular, orthopedics, urology, nerve repair, and other therapeutic areas. He focuses on clinically differentiated technologies addressing meaningful unmet needs and improving standards of care.\n\nPrior to AMED, Jonathan worked in corporate banking and later founded and scaled a consumer healthcare business, bringing experience across financial analysis, commercialization, and business growth.\n\nHe holds an MBA in healthcare from University College London and a B.S. in Biochemical Science and Technology from National Taiwan University.", "/images/team-client/jonathan-feng-unified.png"],
  ]],
  ["Portfolio Strategy & Operations", [
    ["Hank Huang", "Finance & Portfolio Management Manager", "", "/images/team-client/hank-huang-unified.png"],
    ["Michelle Wang", "", "", teamPortraitFallback],
  ]],
] as const;

export const roster = team.flatMap(([group, members]) =>
  members.map(([name, role, bio, portrait]) => ({ name, role, bio, portrait, group })),
);

export const portraitAlignment: Record<string, string> = {
  "Michael Wang": styles.portraitMichael,
  "William Tai": styles.portraitWilliam,
  "Joe Liu": styles.portraitJoe,
  "Dr. TJ Liu": styles.portraitTj,
  "Fred Shen": styles.portraitFred,
  "Michelle Tsai": styles.portraitMichelleTsai,
  "Jeremy Tseng, CFA": styles.portraitJeremy,
  "Bin Chou, Ph.D.": styles.portraitBin,
  "Jonathan Feng": styles.portraitJonathan,
  "Hank Huang": styles.portraitHank,
};

export const stepRoster = (current: number | null, direction: 1 | -1) =>
  current === null ? current : (current + direction + roster.length) % roster.length;

export const fundingStages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C or later", "Not raising yet"] as const;
export const countryCodes = ["+886", "+1", "+81", "+82", "+86", "+852", "+65", "+44", "+61", "+49"] as const;

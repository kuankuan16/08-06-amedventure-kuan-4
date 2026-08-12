# Client brief → site audit

Source: `Copy of Amed Ventures Website Prep Information.pdf`. The PDF has no copyable text layer, so
the text was rebuilt from its embedded font CMaps; quotes below are the brief's own wording.

## In the site

| Brief item | Where it lives in proposal B |
| --- | --- |
| Company name, industry line | Header, contact block |
| Location: Taiwan, US | Contact block (`San Francisco Bay Area · Taipei`) |
| About us (2 paragraphs) | ABOUT — under the pull quote, verbatim |
| Firm Highlights (4 bullets) | ABOUT — two-column list under the paragraphs, verbatim |
| Investment Focus / Approach (2 paragraphs) | COMPANIES — section lede, verbatim |
| Areas may include (8 areas) | COMPANIES — tag row under the lede |
| Investment Philosophy (4 bullets) | ABOUT — the four pillars |
| Team roster, titles | TEAM — four groups, 11 people |
| Four investment-team biographies | TEAM — profile dialog, verbatim |
| Portfolio key statement | COMPANIES — section headline |
| 16 active companies: description, sector, city, founded, website | COMPANIES — tiles and profile dialog |
| Per-company news links | COMPANIES — "In the news" in each company dialog |
| 4 realized companies | COMPANIES — Realized badge, Status filter |
| "interactive, filterable, expandable" portfolio | Focus / Region / Status menus, sort, paging |
| Contact page with country code, company email | CONTACT — form with country-code select, address shown |

## Still needed from AMED — shown in red on the page

| Gap | Where the red marker appears |
| --- | --- |
| Street address ("Company Address" in the brief) | CONTACT — Address row |
| Biographies for Dr. TJ Liu, Dr. Kuan Chen, Fred Shen (brief: "Info Required") | Their profile dialogs |
| Biography for Hank Huang (brief: "Info Required") | His profile dialog |
| Title and biography for Michelle Wang (brief: "Additional team information … to be provided") | Her profile dialog |
| News for Dynaflex (brief: "None"), Wiltrom (brief: "TBD") | Those company dialogs |
| News for the four realized companies | Those company dialogs |

## Still needed from AMED — not shown on the page

These have nowhere to sit until the answer exists, so they are tracked here rather than printed:

- **Key statistics the brief itself leaves open:** "Assets Under Management (AUM)?" and "Years
  Investing?". The hero counters use figures we can verify from the portfolio list (16 / 04 / 08 /
  02) rather than an unanswered AUM.
- **Descriptions for the realized companies** (Neuvera, Truvic, Crossfire, LightningCath) — only
  names were supplied.
- **A logo file for Crossfire Medical** — the company has no live site; its tile shows the wordmark.
- **Brand assets and logo files, office and event photography, marketing materials and brochures** —
  listed in the brief as to be delivered. Team portraits and hero images are placeholders until then.
- **Personal email addresses / LinkedIn profiles** — `teamEmail` and `teamLinkedIn` in
  `src/app/b/page.tsx` hold the firm-level fallbacks; per-person values can be added to the roster.

## Judgement calls

- The brief's "$2 billion" figure appears inside Jeremy Tseng's biography and is scoped to the
  portfolio he manages, so it is quoted only there and never as a firm-wide number.
- "Neuvera" in the brief is **NuVera Medical** (Shifamed, acquired by Biosense Webster in 2020).
  The site keeps the brief's spelling; confirm with AMED before launch.

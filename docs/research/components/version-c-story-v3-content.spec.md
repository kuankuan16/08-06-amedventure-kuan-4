# Version C — expanded Story content

## Reference

- Deployed reference: `https://amedventure-kuan-3.vercel.app/v3`
- Auditable local source:
  `/Users/kuan/Documents/Codex/08-05-amedventure-kuan-3/src/data/amed.ts`

## Content contract

- Version C includes all 30 company-announcement links supplied in the v3 portfolio data.
- Publisher metadata is preferred for title and publication date.
- When a publisher blocks metadata access, retain the client-reference label verbatim and leave
  the date blank unless it is encoded in the publisher's canonical announcement URL.
- Do not invent summaries, milestones or dates.

## Classification

- `Financing`: fundraising is the announcement's main clause.
- `Clinical`: trial initiation, enrolment, first-in-human results or presentation.
- `Regulatory`: FDA clearance, filing or approval.
- `Commercial`: launch, first use, contract, merger, rebrand or product-platform release.

## Existing Version C behaviour retained

- Five stories per page.
- Milestone filters and page reset on filter changes.
- White hover wipe, title/source inset motion and outbound link.
- Missing dates render no placeholder.

# Documentation Hygiene Report — silocrate

- **Repo:** `albethere/silocrate` (PUBLIC)
- **Date:** 2026-07-01 (UTC)
- **Scope:** Non-destructive analysis only. No files deleted, moved, or rewritten. This report proposes actions for a later human-approved run.

---

## 1. Repo purpose & source-of-truth

- Public static landing-page site deployed to GitHub Pages at silocrate.com. No backend, no build step beyond a Prettier lint gate.
- **Source of truth for agents: `AGENTS.md`** — it declares itself "the canonical directive for all agents operating in this repository." `CLAUDE.md` explicitly defers to it.
- Deploy is automatic: push to `main` → `.github/workflows/deploy.yml` (Prettier lint → `actions/deploy-pages`).
- Task coordination lives in `.beads/beads.jsonl`. It records a completed redesign: `site-001` "Convert landing page to mystery/stealth mode", `site-002` abstract hero art, `site-003` SEO/meta scrub.
- Live front door is `index.html` → `assets/css/main.css`, `assets/js/main.js`, `assets/js/hero.js`. A hidden terminal easter egg lives in `terminal.html` → `assets/js/terminal.js` + `assets/css/terminal.css`.

## 2. Scorecard

Total markdown/instruction docs: **4** (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `README.md`).

| Bucket | Count | Files |
|---|---|---|
| AUTHORITATIVE | 1 | AGENTS.md |
| POINTER | 2 | CLAUDE.md, GEMINI.md |
| SUPERSEDED | 1 | README.md |
| DECISION | 0 | — |
| REFERENCE | 0 | — |
| EPHEMERAL | 0 | — |
| DUPLICATE | 0 | — |
| ORPHAN (docs) | 0 | — |

**Hygiene verdict:** Structurally lean (only 4 docs, no ephemera or stale plans), but semantically drifted — the public `README.md` is stale and directly contradicts the canonical directive, and `GEMINI.md` neither defers to `AGENTS.md` nor matches its deploy policy. Zero deletions warranted; the fixes are edits.

## 3. Findings

| Path | Bucket | Problem | Evidence | Recommended action | How to execute |
|---|---|---|---|---|---|
| `AGENTS.md` | AUTHORITATIVE | Canonical, accurate. Minor internal drift: Key Files table omits `assets/js/hero.js` (live, loaded by index.html) and `assets/css/terminal.css` (which its own protected-files list includes). | `index.html` line 152 loads `hero.js`; AGENTS.md §Key Files lacks it. | KEEP (optional EDIT) | Optional: add rows for `assets/js/hero.js` and `assets/css/terminal.css` to the Key Files table. No deletion. |
| `CLAUDE.md` | POINTER | None. Correctly defers to AGENTS.md; all claims (public, no secrets, easter-egg protection, beads) agree with authoritative. | Line 3: "Read AGENTS.md first — it is the canonical directive." | KEEP | none |
| `GEMINI.md` | POINTER | (a) Does NOT defer to `AGENTS.md` (no pointer to canonical file). (b) Names "Cloudflare Pages" as a viable host — conflicts with AGENTS.md which calls GitHub Pages "the only deploy mechanism" and forbids new infra. (c) References `main.js` for design alignment — ambiguous given the root `main.js` is now an unreferenced legacy file. | GEMINI.md line 7 (Cloudflare Pages) vs AGENTS.md §Deployment + Rule 3; GEMINI.md line 13 (`main.js`). | EDIT | Add a top deferral line: `> Read AGENTS.md first — it is the canonical directive for this repo.` and reconcile the deploy-target wording to GitHub Pages only. No deletion. |
| `README.md` | SUPERSEDED | Describes the repo as "a hacker-flavoured interactive terminal game" (xterm.js v5) and says "Follow the white rabbit" — advertising the easter egg that AGENTS.md says must be "discovered, not advertised," and explaining the site in a way that breaks the mandated mystery. Structure block lists root `main.js`/`style.css` as the entry point and omits `index.html`, `assets/`, and `hero.js` — the post-redesign reality. | README last changed 4 months ago (commit `17486f5`, pre-redesign); `index.html` mystery-mode landing is 3 months old; beads `site-001` = "Convert landing page to mystery/stealth mode". Conflicts with AGENTS.md §"The Easter Egg" and Rules of Engagement #1. | EDIT (rewrite to minimal, opaque, redesign-accurate) | Rewrite to a short opaque README describing only a public static site on GitHub Pages; remove terminal-game description, "white rabbit," and the stale Structure tree. Do NOT delete (a public repo needs a README). Flagged for the follow-up run. |

## 4. Contradictions ledger

1. **README vs AGENTS.md — site identity & easter-egg secrecy (TOP).** `README.md` frames the whole site as a terminal game and advertises the hidden terminal ("Follow the white rabbit"). `AGENTS.md` (source of truth) mandates the landing page as the front door, the terminal as a hidden easter egg that is "discovered, not advertised," and "Maintain the mystery." **Resolution:** AGENTS.md wins; rewrite README to remove the terminal-game framing and easter-egg advertisement.
2. **README structure vs actual layout.** README's Structure tree lists root `main.js`/`style.css`/`index.html` only; the live site uses `assets/js/main.js`, `assets/js/hero.js`, `assets/css/main.css`, plus the easter-egg trio. **Resolution:** AGENTS.md Key Files table is authoritative; README's tree is stale and should be corrected or dropped in the rewrite.
3. **GEMINI.md vs AGENTS.md — deploy target.** GEMINI.md permits Cloudflare Pages; AGENTS.md restricts to GitHub Pages and bans new infra. **Resolution:** AGENTS.md wins; GEMINI.md wording corrected.
4. **GEMINI.md non-deferral.** Unlike CLAUDE.md, GEMINI.md does not name AGENTS.md as canonical, so a Gemini-driven agent could act on GEMINI.md's divergent policy. **Resolution:** add a deferral header.

## 5. Proposed prune set (DELETE / ARCHIVE)

**None.** No documentation qualifies for deletion or archival: there are no `*-old`/`*.bak`/duplicate/ephemeral/dated-status docs, and no doc-level orphans. The defects here are content contradictions fixed by EDIT (items in §3), not by pruning. **PRUNE_COUNT = 0.**

## 6. Out-of-scope / left alone

- **Protected easter-egg files (DO NOT TOUCH):** `assets/js/main.js`, `assets/js/terminal.js`, `terminal.html`, `assets/css/terminal.css`, `style.css`. Not analyzed for modification.
- **Code orphans (noted, not actioned — out of documentation scope, non-destructive run):** root `main.js` and root `style.css` are unreferenced by any live HTML (index.html and terminal.html load only `assets/…` paths) and appear to be pre-redesign legacy. Root `style.css` is on the AGENTS.md protected list, so leave it. Any decision on root `main.js` is a code review, not a doc-hygiene action — flag for the Operator; recommend KEEP pending human review.
- **No secrets, IPs, topology, or architecture detail** were surfaced or included in this report, per the repo's PUBLIC classification.

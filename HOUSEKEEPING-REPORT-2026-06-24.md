# Documentation Hygiene Report — silocrate

**Date (UTC):** 2026-06-24
**Repo:** `albethere/silocrate` (public)
**Branch:** `chore/housekeeping-2026-06-24`
**Run type:** NON-DESTRUCTIVE — analysis only. Nothing in this run deletes, moves, renames, or rewrites any documentation or code. This report is the only file created. Deletions, if approved, happen in a later human-approved execution run.

> **Easter-egg guard observed.** This run only read and reported. The protected files (`assets/js/main.js`, `assets/js/terminal.js`, `terminal.html`, `style.css`, `assets/css/terminal.css`) were not modified. Zero secrets appear in this report.

---

## 1. Repo purpose & source-of-truth summary

- **What it is:** A single-page **static landing site** for `silocrate.com`, deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. Pure HTML/CSS/JS, no backend, no build step.
- **Current identity (post-pivot):** "Mystery mode" — an opaque, restrained, Apple/Linear/Vercel-aesthetic landing page (`index.html` + `assets/js/hero.js` canvas node-network + `assets/js/main.js`). It deliberately does **not** explain what Silocrate is.
- **Hidden layer:** A terminal-game easter egg (`terminal.html`, `assets/js/terminal.js`) reached via Konami code or triple-clicking the footer `>_`. Sacred; discovered, not advertised.
- **Source of truth:** **`AGENTS.md`** is the declared canonical directive. `CLAUDE.md` correctly defers to it ("Read `AGENTS.md` first"). Task coordination is the beads tracker (`.beads/beads.jsonl`).
- **Classification:** PUBLIC. No internal architecture, IPs, topology, or private repo references may ever appear here.

The beads tracker confirms the pivot: `site-001` "Convert landing page to mystery/stealth mode" (in_progress), `site-002` hero canvas art (done), `site-003` SEO/meta scrub to opaque copy (done) — all dated 2026-04-05, consistent with the current `index.html`.

---

## 2. Scorecard

| Bucket | Count | Files |
|---|---|---|
| AUTHORITATIVE | 1 | `AGENTS.md` |
| POINTER | 1 | `CLAUDE.md` |
| DECISION (preserve) | 0 | — |
| REFERENCE | 0 | — |
| EPHEMERAL | 0 | — |
| DUPLICATE | 0 | — |
| ORPHAN / STALE | 1 | `README.md` |
| SUPERSEDED | 1 | `GEMINI.md` |

**Total doc files scanned:** 4 (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `README.md`). No `.mdc`, `.agent.md`, `SKILL.md`, `.cursorrules`, `.github/copilot-instructions.md`, `docs/`, or `docs/prompts/` exist in this repo.

**Overall hygiene verdict:** **Good core, two stale outliers.** The canonical pair (`AGENTS.md` + `CLAUDE.md`) is accurate and internally consistent. Two documents (`README.md`, `GEMINI.md`) predate the mystery-mode pivot, describe a different product identity, and actively contradict the canonical directive — they are the clean-up surface. No decision records exist to endanger; pruning risk is low.

---

## 3. Findings table

| Path | Bucket | Problem | Evidence | Recommended action | How to execute |
|---|---|---|---|---|---|
| `AGENTS.md` | AUTHORITATIVE | None — accurate and current. | Declares itself canonical (line 3). Key-files table, easter-egg list, deploy mechanism, and PUBLIC classification all match the live tree (`assets/`, `index.html`, `terminal.html`, `.github/workflows/deploy.yml`, `.beads/beads.jsonl` all present). Last touched 2026-04-05 (pivot commit). | KEEP | No action. |
| `CLAUDE.md` | POINTER | None — correctly defers. | Line 3: "Read `AGENTS.md` first — it is the canonical directive." Its 5 bullets (public, auto-deploy, easter-egg no-touch list, beads, mystery purpose) all agree with `AGENTS.md`. Same commit date 2026-04-05. | KEEP | No action. |
| `README.md` | ORPHAN / STALE | Describes the repo as "*a hacker-flavoured interactive terminal game*" — the **pre-pivot** identity. Contradicts the mystery-mode landing page that is now the front door. Structure diagram is factually wrong. | Line 5 calls it a terminal game; `grep -niE 'mystery\|landing\|waitlist\|opaque' README.md` → no matches. Structure block (lines 32–41) claims root-only `main.js` + `style.css` and shows **no `assets/` directory**, omits `terminal.html`, and lists no `index.html` content match — but reality has `assets/js/{hero,main,terminal}.js`, `assets/css/{main,terminal}.css`, and `index.html` references `assets/js/hero.js` + `assets/js/main.js` (root `main.js`/`style.css` are referenced by **no** HTML). Last touched 2026-03-07, before the 2026-04-05 pivot. | EDIT (preferred) or DELETE | EDIT: rewrite `README.md` to describe the current mystery-mode static landing page, declare `AGENTS.md` as the canonical directive, and replace the inaccurate structure block with the real tree (`index.html`, `assets/css/{main,terminal}.css`, `assets/js/{hero,main,terminal}.js`, `terminal.html`, `.github/workflows/deploy.yml`). Keep it opaque per Rule of Engagement #1 — do not reveal product intent. Alternatively `git rm README.md` if a public README is deemed unnecessary for a mystery site. **Defer to operator; do not execute in this run.** |
| `GEMINI.md` | SUPERSEDED | "Starfleet Public Affairs Officer" persona doc. Describes the public face as "professional and sleek" and injects a Star Trek / "Romulan sabotage" flavor that conflicts with the established Apple/Linear/Vercel design language and "confident silence" tone in `AGENTS.md`. Never names `AGENTS.md` as canonical, creating a third, divergent instruction voice. Predates the pivot. | Lines 1–4 (Starfleet persona); line 9 "professional and sleek" vs `AGENTS.md` line 52 "NOT a hacker CTF, NOT a terminal aesthetic." No `canonical`/`AGENTS.md`/`defer` reference anywhere in the file (`grep` returned nothing). Last touched 2026-03-07, pre-pivot. Its only still-true facts (public-only, static, supply-chain scrutiny) are already fully covered by `AGENTS.md`. | DELETE (or EDIT to a one-line pointer) | DELETE: `git rm GEMINI.md`. If Gemini-agent compatibility is desired, instead replace contents with a single pointer line: "> Read `AGENTS.md` — it is the canonical directive for this repo." **Defer to operator; do not execute in this run.** |

---

## 4. Contradictions ledger

1. **Product identity conflict.** `README.md` (line 5) presents Silocrate as a public "hacker-flavoured interactive terminal game." `AGENTS.md` (lines 50–54) mandates the public surface be an opaque, restrained consumer landing page that is explicitly **NOT** a terminal/hacker aesthetic, with the terminal living hidden "underneath." The README leaks and mischaracterizes the easter egg as the headline product.
2. **Canonical-authority gap.** `CLAUDE.md` defers to `AGENTS.md` as canonical. `README.md` and `GEMINI.md` make **no** such deference and present their own framing, so an agent reading either in isolation would not learn which file governs. Only the canonical pair agrees.
3. **Tone conflict.** `GEMINI.md` mandates a "Starfleet Command tone" and "professional and sleek" public face; `AGENTS.md` mandates "confident silence" / tasteful minimalism and forbids the hacker aesthetic. Two incompatible tone directives for the same surface.
4. **Structural staleness (factual).** `README.md`'s structure diagram omits the entire `assets/` tree and `terminal.html`, and lists root `main.js`/`style.css` as the live assets, yet `index.html` loads `assets/js/hero.js` and `assets/js/main.js` and root `main.js`/`style.css` are referenced by no HTML file. The diagram does not describe the current repo.

No contradictions were found **within** the canonical pair (`AGENTS.md` ↔ `CLAUDE.md`); they are consistent on classification, easter-egg file list, deploy mechanism, and beads usage.

---

## 5. Proposed prune set (for batch approval)

> Grouped for the operator. NOTHING is deleted in this run.

**Group A — DELETE candidates (1 file):**
- `GEMINI.md` — superseded Starfleet persona; conflicts with canonical tone/identity; unique still-true facts already covered by `AGENTS.md`. (Alternative: reduce to a one-line pointer to `AGENTS.md`.)

**Group B — EDIT-or-DELETE candidate (1 file):**
- `README.md` — stale pre-pivot product description with a factually wrong structure diagram. **Preferred action is EDIT** (rewrite to current opaque reality + point at `AGENTS.md`), not delete, since a public repo conventionally benefits from a README. Listed here so the operator can choose EDIT vs DELETE.

**Net hard-delete proposed: 1 file (`GEMINI.md`).** `README.md` is recommended for EDIT, with DELETE offered only as an operator option.

---

## 6. Out of scope / left alone

- **Canonical instruction docs — KEEP:** `AGENTS.md` (authoritative), `CLAUDE.md` (accurate pointer). Untouched.
- **Decision records:** none exist (no ADR/CHARTER/MISSION files), so none were pruned. No ADR was recommended for deletion.
- **Protected easter-egg / code files (read-only this run, never modified):** `assets/js/main.js`, `assets/js/terminal.js`, `terminal.html`, `style.css`, `assets/css/terminal.css`. Note: root `main.js` and root `style.css` appear unreferenced by any HTML, but they are **code files outside this documentation-hygiene scope** and are additionally on/adjacent to the protected list — they are intentionally **not** assessed or recommended for action here.
- **Operational/coordination files (not docs):** `.beads/beads.jsonl`, `.github/workflows/deploy.yml`, `CNAME`, `index.html`, `assets/css/main.css`, `assets/js/hero.js` — active, left alone.

---

## Note on tooling

The GitHub approval issue accompanying this report was opened via the **GitHub MCP API** (`mcp__github__issue_write`), because the `gh` CLI is unavailable in this environment.

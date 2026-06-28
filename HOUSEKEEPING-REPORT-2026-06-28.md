# Housekeeping Hygiene Report — silocrate

**Date (UTC):** 2026-06-28
**Scope:** Documentation hygiene sweep of the `silocrate` repository (public). Non-destructive: this report is the only file added; no existing doc or code was modified, moved, or deleted.

---

## 1. Repo Purpose & Source-of-Truth

- **What it is:** `silocrate` is the source for **silocrate.com**, a single-page static landing site deployed to GitHub Pages. The current public front door (`index.html`) is a deliberately **opaque "mystery mode" landing page** (Inter typography, muted palette, tagline *"Not everything announces itself."*) — *not* a terminal/hacker surface.
- **Source of truth:** **`AGENTS.md`** is the declared canonical directive ("This is the canonical directive for all agents operating in this repository"). `CLAUDE.md` correctly defers to it. `GEMINI.md` does **not** defer. `README.md` predates and contradicts the current direction.
- **Hard constraints (from AGENTS.md / CLAUDE.md):** Public repo — **zero secrets, zero internal topology, zero architecture details**. Maintain mystery/opacity; **do not explain what Silocrate is**.
- **Deploy:** Automatic — push to `main` triggers GitHub Actions (`deploy.yml`: Prettier lint → `actions/deploy-pages`). No backends, no build step.
- **Sacred easter egg:** A hidden xterm.js terminal game (konami code / triple-click `>_` footer button). It is **discovered, not advertised**. Protected files must not be modified or referenced in visible copy/metadata: `assets/js/main.js`, `assets/js/terminal.js`, `terminal.html`, `assets/css/terminal.css`, `style.css`.

---

## 2. Scorecard

| Bucket | Count | Files |
|---|---|---|
| AUTHORITATIVE | 1 | `AGENTS.md` |
| POINTER | 2 | `CLAUDE.md`, `GEMINI.md` |
| DECISION | 0 | — |
| REFERENCE | 0 | — |
| EPHEMERAL | 0 | — |
| DUPLICATE | 0 | — |
| ORPHAN / SUPERSEDED | 1 | `README.md` |
| **Total md files** | **4** | |

**Hygiene verdict:** **Fair, with two concrete defects.** The canonical/pointer chain is mostly sound (AGENTS.md authoritative, CLAUDE.md defers correctly), but (a) `README.md` is a stale pre-pivot artifact that *publicly contradicts the mystery mandate and advertises the easter egg*, and (b) `GEMINI.md` is an off-theme pointer that neither defers to AGENTS.md nor agrees with its persona/direction. No secrets, no duplicates, no orphaned cross-references between docs.

---

## 3. Findings Table

| Path | Bucket | Problem | Evidence | Recommended action | How to execute |
|---|---|---|---|---|---|
| `AGENTS.md` | AUTHORITATIVE | None. Accurately describes current site (mystery landing), file map matches disk (`assets/css/main.css`, `assets/js/main.js`, `terminal.html`, etc. all exist), deploy model correct. | L3 "canonical directive"; L33 `index.html` "Landing page"; file map verified against `find assets -type f`. | **KEEP** | No action. |
| `CLAUDE.md` | POINTER | None material. Correctly defers and restates only the few load-bearing constraints (public, auto-deploy, easter-egg protection, opacity). Adds Claude-relevant brevity without duplicating AGENTS.md wholesale. | L3 "Read **`AGENTS.md`** first — it is the canonical directive"; L7-11 concise constraint list. | **KEEP** | No action. |
| `GEMINI.md` | POINTER | (a) Does **not** defer to AGENTS.md — no pointer to the canonical file. (b) Off-theme persona ("Starfleet Public Affairs Officer") conflicts with AGENTS.md design directive ("NOT a hacker CTF, NOT cyberpunk"; consumer surface). (c) References only root `main.js`; silent on the `assets/js/` split and the easter-egg protection list. | L1 "Starfleet Command Agentic Instructions"; L3 "You are the **Starfleet Public Affairs Officer**"; no occurrence of "AGENTS.md" anywhere in file. | **EDIT** (add deferral header + remove direction-conflicting claims) | Add as the first line under the H1: `> Read **\`AGENTS.md\`** first — it is the canonical directive for this repo.` Then ensure no operational rule in GEMINI.md contradicts AGENTS.md (keep the public/no-internal-details and supply-chain points; drop or reframe anything implying a hacker/Starfleet *visible* aesthetic, since AGENTS.md L52 forbids it). Keep flavor confined to internal log tone only, as GEMINI.md L9 already scopes it. |
| `README.md` | ORPHAN / SUPERSEDED | Pre-pivot artifact (4 months old; AGENTS.md/CLAUDE.md mystery-mode pivot is 3 months old, per `git log`). (a) **Violates opacity mandate** — publicly advertises and explains the easter egg. (b) **Mischaracterizes the site** as primarily a terminal game rather than the mystery landing. (c) **Stale structure block** — omits `assets/`, `index.html`, `terminal.html`, `CNAME`; lists a flat layout that no longer matches disk. | L3 tagline *"Boiled tongues, jellied eels, and spam detection."*; L5 "a hacker-flavoured interactive terminal game"; L9 "credential cracking… hidden flags. **Follow the white rabbit.**"; L32-41 structure block missing `assets/` and `index.html`. Conflicts with AGENTS.md L52 ("NOT a terminal aesthetic"), L62 ("Do not reference it in visible UI copy or metadata. It is discovered, not advertised"), L73 ("Maintain the mystery"). Beads `site-001`/`site-003` confirm the scrub-to-mystery pivot. | **EDIT** (rewrite to mystery-aligned, opaque README) — do **not** DELETE; a public repo benefits from a minimal, on-brand README, and deletion is destructive. | Replace README body with a minimal, opaque description that does **not** reveal product intent or the easter egg: keep only (i) one neutral line that it is the source for a static GitHub Pages site at silocrate.com, (ii) `npx serve .` local-run note, (iii) deploy note (push `main` → Actions → Pages, Prettier lint), (iv) a `Structure` block regenerated from actual disk layout (`index.html`, `assets/css/main.css`, `assets/js/{main,hero}.js`, `CNAME`, `.github/workflows/deploy.yml`) with **no** mention of `terminal.html`/the game. Per task constraints this report does not perform the rewrite; flag for Operator approval. |

---

## 4. Contradictions Ledger

| # | Conflict | Files involved | Evidence | Proposed resolution (tied to source-of-truth) |
|---|---|---|---|---|
| 1 | **What the site IS.** README says the site is "a hacker-flavoured interactive terminal game"; AGENTS.md says the public front door is a restrained consumer landing page, "NOT a terminal aesthetic." Disk confirms `index.html` is the Inter/OG mystery landing; the terminal is the *hidden* easter egg. | `README.md` vs `AGENTS.md` (+ `index.html`) | README L5/L9 vs AGENTS.md L33, L46-54, L62. | AGENTS.md wins (canonical, and matches disk + beads `site-001`). Rewrite README to describe the mystery landing; relegate the terminal to undocumented easter egg (i.e., omit it). |
| 2 | **Easter-egg secrecy.** README publicly advertises and explains the easter egg ("Follow the white rabbit", "hidden flags", boot/crack/scan walkthrough); AGENTS.md mandates it be discovered, not advertised, and never referenced in visible copy. README *is* public-facing copy. | `README.md` vs `AGENTS.md` | README L3, L5, L9 vs AGENTS.md L56-69. | AGENTS.md wins. Remove all easter-egg references from README. |
| 3 | **Canonical-file deference & persona.** GEMINI.md never points to AGENTS.md and frames the agent as a "Starfleet" actor, conflicting with AGENTS.md's explicit "NOT cyberpunk / NOT a hacker CTF" consumer-surface directive. CLAUDE.md, by contrast, defers correctly. | `GEMINI.md` vs `AGENTS.md` (and inconsistent with `CLAUDE.md`'s correct pattern) | GEMINI.md L1, L3 (no "AGENTS.md" present) vs CLAUDE.md L3 deferral; AGENTS.md L3, L52. | AGENTS.md wins. Add the standard deferral header to GEMINI.md and confine any flavor to internal-log tone only (as GEMINI.md L9 already allows), so it cannot leak into the public visible surface. |

---

## 5. Proposed Prune Set

**DELETE: 0**
**ARCHIVE: 0**
**Total prune count: 0.**

Rationale: No file is a safe deletion/archive candidate. `README.md` is stale and contradictory but a public repo warrants a (corrected) README — the right action is **EDIT**, not removal (removal would also be destructive, which this task forbids). `GEMINI.md` is a live per-tool pointer that needs a deferral header, not deletion. Nothing is duplicate, ephemeral, or a dead `.bak`/`v1` artifact.

**Edits flagged for Operator approval (non-destructive, content-corrective):**
1. `README.md` → rewrite to mystery-aligned, easter-egg-free content with a corrected structure block (Contradictions #1, #2).
2. `GEMINI.md` → add `> Read **AGENTS.md** first — it is the canonical directive for this repo.` and remove visible-surface persona conflicts (Contradiction #3).

---

## 6. Out-of-Scope / Left Alone

- **Protected easter-egg / asset files — not touched, not recommended for change:** `assets/js/main.js`, `assets/js/terminal.js`, `terminal.html`, `assets/css/terminal.css`, `style.css`, plus the root terminal game `main.js`. (CLAUDE.md L9 / AGENTS.md L64-69.)
- **Deploy pipeline:** `.github/workflows/deploy.yml` — left alone (AGENTS.md L76 forbids changes without approval). It correctly Prettier-lints then deploys via `actions/deploy-pages@v4`.
- **`.beads/beads.jsonl`:** coordination data, not documentation — left alone. (Confirms the mystery-mode pivot: `site-001`, `site-003`.)
- **`CNAME`** (`silocrate.com`), `index.html` — production assets, out of doc-hygiene scope.
- **Secrets / sensitive data:** None found. Repo is public and holds no IPs, tokens, internal hostnames, or topology. One supply-chain note for awareness only (no action recommended here, file is protected): `terminal.html` loads xterm.js v5 from `cdn.jsdelivr.net` (pinned `@5.5.0`); consistent with AGENTS.md's "external dependencies require scrutiny" mandate but pinned and out of scope for this sweep.

---

*Generated by the documentation-hygiene agent. Analysis only — no existing file was modified, moved, or deleted.*

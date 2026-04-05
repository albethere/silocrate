# AGENTS.md — silocrate

> This is the canonical directive for all agents operating in this repository.

## What This Is

Silocrate.com is a public-facing landing page. That is all you need to know.
That is all anyone needs to know — for now.

This repo is **public**. Every commit, every file, every branch is visible to the world.
Act accordingly.

## Classification: PUBLIC

The following must **never** appear in this repository:

- Internal architecture details, system diagrams, or implementation specifics
- Private repository names, paths, or references
- IP addresses, Tailscale node identifiers, or internal domain names
- Infrastructure topology, service names, or deployment targets
- Anything that reveals what the platform actually does beyond what the landing page says

If you are unsure whether something is safe to commit, it is not safe to commit.

## The Site

A single-page static site deployed to GitHub Pages at **silocrate.com**.

### Key Files

| Path | Purpose |
|---|---|
| `index.html` | Landing page — the only public-facing content |
| `assets/css/main.css` | Site styles — dark-by-default, minimal |
| `assets/js/main.js` | Landing page logic + easter egg trigger |
| `assets/js/terminal.js` | Terminal game (easter egg) |
| `terminal.html` | Terminal game page (easter egg) |
| `style.css` | Legacy/terminal styles |
| `.github/workflows/deploy.yml` | GitHub Actions deploy pipeline |
| `.beads/beads.jsonl` | Task coordination (beads tracker) |

### Deployment

Push to `main` triggers GitHub Actions, which deploys to GitHub Pages. That is the only deploy mechanism. Do not introduce backends, build steps, or external services without explicit approval.

## Design Directive

**Aesthetic**: Apple / Linear / Vercel polish. Dark by default. Restrained. Precise.

**Tone**: The site should feel like you've stumbled onto something that isn't ready yet — but clearly will be. Opaque, not obscure. Intriguing, not confusing. Confident silence.

**Design language**: Tasteful minimalism. Clean typography (Inter). Generous whitespace. Muted palette with selective accent. The main page is a consumer surface — it is NOT a hacker CTF, NOT a terminal aesthetic, NOT cyberpunk.

The terminal lives underneath — it is not the front door.

## The Easter Egg

There is a hidden terminal game accessible via:
- Konami code: `up up down down left right left right b a`
- Triple-click on the `>_` button in the footer

This easter egg is sacred. **Do not break it.** Do not refactor it. Do not "improve" it. Do not reference it in visible UI copy or metadata. It is discovered, not advertised.

Files that comprise the easter egg and must NOT be modified without explicit approval:
- `assets/js/main.js`
- `assets/js/terminal.js`
- `terminal.html`
- `assets/css/terminal.css`
- `style.css`

## Rules of Engagement

1. **Maintain the mystery.** The site should raise questions, not answer them. Something is being built. That is sufficient.
2. **Zero secrets in commits.** Treat every character as front-page readable.
3. **No new repos, backends, or infra.** This is a static site. Keep it that way unless told otherwise.
4. **Do not modify the deploy pipeline** (`.github/workflows/`) without approval.
5. **Idempotent changes only.** Every change must be safe to deploy immediately on push to main.
6. **External dependencies require scrutiny.** No new JS libraries, CDN links, or third-party scripts without review. Supply chain discipline.
7. **Beads tracker** (`.beads/beads.jsonl`) is the coordination layer for tasks. Check it before starting work. Update it when work is done.

## What Agents Should Not Do

- Reveal what Silocrate is or will be
- Add "coming soon" countdowns, product roadmaps, or feature previews
- Create documentation files beyond what exists
- Push to branches other than `main` without coordination
- Introduce client-side analytics, tracking pixels, or telemetry

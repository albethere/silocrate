# silocrate

> *Boiled tongues, jellied eels, and spam detection.*

Live at **[silocrate.com](https://silocrate.com)** — a hacker-flavoured interactive terminal game, deployed via GitHub Pages.

## What is this

An in-browser terminal experience built with [xterm.js v5](https://xtermjs.org/). Boot sequence, network scan, credential cracking, file exploration, and hidden flags. Follow the white rabbit.

## Running locally

```bash
npx serve .
# → http://localhost:3000
```

No build step. Pure HTML/CSS/JS.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which:

1. **Lints** HTML, CSS, and JS with [Prettier](https://prettier.io/).
2. **Deploys** to GitHub Pages via `actions/deploy-pages`.

> [!NOTE]
> The repo must have GitHub Pages configured to use "GitHub Actions" as the source (not the legacy "branch" mode).

## Structure

```
silocrate/
├── index.html              # Entry point
├── main.js                 # Terminal game logic (xterm.js v5)
├── style.css               # Styles
├── CNAME                   # Custom domain
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD pipeline
```

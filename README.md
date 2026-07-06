# MB Global Apparels — Company Website

A static company-profile website for MB Global Apparels, a Bangladesh-based
apparel sourcing house. Built with plain HTML/CSS/JS (no framework/build step)
and served via a minimal Express server for Railway deployment.

## Pages

- `index.html` — Home
- `about.html` — Company story, mission/vision, values, timeline, team
- `services.html` — Services, process timeline, lead-time/MOQ estimator
- `products.html` — Capabilities (knitwear & woven categories, filterable)
- `clients.html` — Industries served, testimonials, export markets, compliance
- `contact.html` — Contact form, office info, map, FAQ
- `404.html` — Not-found page

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## Deploy on Railway

1. Push this repo to GitHub (already connected to the `origin` remote).
2. In Railway, create a new project from this GitHub repo.
3. Railway auto-detects Node via `package.json` and runs `npm start`.
4. No environment variables are required.

## Before going live — replace placeholders

This build uses intentional placeholders so the structure/design can be
reviewed before real assets are ready. Search for and replace:

- **Images** — every `<div class="ph ...">` block is a styled placeholder.
  Replace with a real `<img>` tag once photography is available.
- **Contact details** — address, email, and phone number in `contact.html`
  and every page footer are placeholders.
- **Client names & testimonials** — the marquee brand names and testimonial
  quotes/attributions on the home and clients pages are illustrative, not real.
- **Certifications** — the compliance badges (BSCI/WRAP/OEKO-TEX/ISO 9001) on
  `clients.html` are shown as examples. Confirm which standards your actual
  partner factories hold before publishing.
- **Stats** — years in business, factory count, capacity, and export-market
  percentages are placeholder figures; update with real numbers.
- **Contact form** — currently shows a client-side success state only (no
  backend). Wire it to an email service (e.g. Formspree, EmailJS) or a small
  backend route in `server.js` before relying on it for real inquiries.
- **Team photos & names** on `about.html`.

## Tech notes

- No build step — plain HTML/CSS/JS, single stylesheet (`css/style.css`) and
  single script (`js/main.js`) shared across all pages.
- Dark mode toggle persists via `localStorage`.
- All animations are CSS/IntersectionObserver based — no external animation
  libraries.

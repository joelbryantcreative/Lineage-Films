# Lineage Films — website

Live at [lineagefilms.com.au](https://lineagefilms.com.au).

Static one-page site for Lineage Films, a Byron Bay cinematic studio making brand
films and documentary work. Built as plain HTML, CSS and vanilla JS — no
frameworks, no build step — so it's fast to deploy and easy to edit by hand.

## Project structure

```
/
├── index.html              # The whole site — one page, nine sections
├── css/
│   └── styles.css          # All styles. CSS variables for palette + type.
├── js/
│   └── main.js             # Header scroll state, mobile nav, pillar accordion
├── public/
│   ├── logo.svg            # Brand mark (drop in)
│   ├── logo.png            # PNG fallback (drop in)
│   ├── favicon.ico         # Favicon (drop in)
│   ├── images/             # Site imagery — work thumbs, OG image, etc.
│   └── videos/             # Hero placeholder + any embedded clips
└── README.md
```

## Sections (in `index.html`)

1. **Hero** — full-viewport video background (gradient placeholder until
   `/public/videos/hero-placeholder.mp4` is added; uncomment the `<video>`
   block in `index.html` when ready).
2. **Approach** — manifesto + three expandable pillars (Witness · Craft · Depth).
3. **Work** — six-card grid of placeholder case studies.
4. **Services** — Brand Films · Documentary · Heritage & Provenance.
5. **Who we work with** — Industries / Outputs two-column list.
6. **Testimonials** — three quotes side-by-side + greyscale logo strip.
7. **Latest film** — featured player placeholder.
8. **Contact** — Heartwood Rust CTA section with email and socials.
9. **Footer** — minimal credit + ecosystem links.

Placeholder copy is marked with `<!-- PLACEHOLDER -->` comments in the HTML.

## Brand tokens

Everything visual is controlled by CSS variables at the top of `css/styles.css`.

```css
--deep-forest:    #1F2A24
--heartwood-rust: #8B4A3C
--bone:           #EFE6D4
--moss:           #5A6B4D
--smoke:          #7A736A
--near-black:     #0E0E0E
```

Typography:

- **Headlines** — Cormorant Garamond (serif), lowercase
- **Body** — Inter (sans)
- **Labels / accents** — JetBrains Mono (mono), uppercase with wide tracking

All three are loaded from Google Fonts in the `<head>` of `index.html`.

## Running it locally

There's no build step, so you can open `index.html` directly — but the
absolute paths (`/css/...`, `/public/...`) work best when served from a
local web server. Two easy options:

### Option A — VS Code Live Server
1. Install the **Live Server** extension by Ritwick Dey.
2. Right-click `index.html` → **Open with Live Server**.

### Option B — One-line Python server
From a terminal in the project folder:
```
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option C — Vercel CLI (matches production)
```
npx vercel dev
```

## Editing content

- **Copy** lives in `index.html`. Section headings, manifesto, pillars,
  service blurbs, testimonials, footer — all editable in place.
- **Colours / type** live as CSS variables in `css/styles.css` (top of file).
- **Work case studies** — duplicate a `<li class="work-card">` block in the
  Work section, swap thumbnail (replace the `.work-card__thumb` background
  with an `<img>`), client name, title and description.
- **Pillars** — accordion behaviour is automatic for any `<details data-pillar>`
  inside `.approach__pillars`. Add more if needed.
- **Footer year** — auto-updates via `data-year` in `js/main.js`.

## Assets to drop in

| Path | What |
| --- | --- |
| `/public/logo.svg` | Primary fingerprint mark (cream on rust circle) |
| `/public/logo.png` | PNG fallback for older clients |
| `/public/favicon.ico` | Favicon |
| `/public/videos/hero-placeholder.mp4` | Hero reel (then uncomment `<video>` in `index.html`) |
| `/public/images/hero-poster.jpg` | First-frame poster for the hero video |
| `/public/images/og-image.jpg` | 1200×630 social share image |
| `/public/images/work-*.jpg` | Work thumbnails (replace `.work-card__thumb` gradient) |

## Deployment — GitHub + Vercel

This site is built to deploy as-is on Vercel (same stack as
`joelbryant.com.au` and `joinnorthstar.co`).

1. **Push to GitHub** — commit from GitHub Desktop on the working branch,
   then merge to `main` when ready.
2. **Import the repo into Vercel**
   - vercel.com → **Add New… → Project** → pick the `Lineage-Films` repo.
   - Framework preset: **Other** (it's static).
   - Root directory: leave as `/`.
   - Build command: *(leave empty)*
   - Output directory: *(leave empty — Vercel serves the repo root)*
3. **Deploy.** Every push to `main` triggers a production deploy; every
   push to another branch creates a preview URL.
4. **Custom domain** — add `lineagefilms.com.au` under Project → Settings →
   Domains once DNS is ready.

## Accessibility & SEO notes

- Semantic landmarks: `<header>`, `<main>`, `<section>` with `aria-labelledby`,
  `<footer>`.
- `prefers-reduced-motion` is respected (smooth scroll + animations disabled).
- WCAG: the Heartwood Rust + Bone combination on the Contact section meets
  AA for large text; double-check any small text overlays before shipping.
- Meta title, description, OG tags and JSON-LD `LocalBusiness` schema are in
  place — update the OG image path and any URLs once the domain is live.

## What's next (iteration list)

- Drop in real logo + favicon + hero video.
- Replace `<!-- PLACEHOLDER -->` work cards with real case studies.
- Final manifesto copy.
- Real testimonials + client logos.
- Featured film embed.
- Confirm domain → update JSON-LD `url` and OG `image` paths.

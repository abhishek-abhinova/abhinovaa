# Abhinova — Official Website

Premium multi-page static website for Abhinova: AI, web, e-commerce, branding & automation studio.

## Pages

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Hero, stats, services preview, featured projects, why-us, process, testimonials, blog preview |
| Services | `services.html` | All 6 services + transparent pricing (multi-currency) + FAQ |
| Projects | `projects.html` | All 22+ projects with filters and case-study modals |
| Blogs | `blog.html` | SEO articles with category filters |
| About Us | `about.html` | Story, mission/vision, founder, co-founder, full team |
| Contact Us | `contact.html` | Contact channels, project brief form (sends via WhatsApp), FAQ |

## Structure

```
├── index.html / services.html / projects.html / blog.html / about.html / contact.html
├── sitemap.xml · robots.txt · vercel.json
└── assets/
    ├── css/main.css      ← design system (dark futuristic theme)
    ├── js/data.js        ← ALL content: services, pricing, projects, team, blogs, currencies
    ├── js/main.js        ← UI engine: currency switcher, animations, renderers
    └── img/
        ├── brand/        ← logos
        ├── team/         ← team photos
        └── projects/     ← project screenshots
```

## Editing content

Almost everything (projects, team members, blog posts, prices, currency rates) lives in
**`assets/js/data.js`** — edit that one file and every page updates automatically.

## Currency switcher

Prices are stored in USD (`data-usd` attributes) and converted client-side using the rates
in `CURRENCIES` (data.js). Supports USD, INR, EUR, GBP, CNY, JPY, AED, BRL, CAD.
Auto-detects visitor country on first visit; choice is remembered in localStorage.

## Deploying to Vercel

Static site — no build step, no backend.

1. Push this repo to GitHub.
2. In Vercel: **Add New Project → Import** this repo.
3. Framework preset: **Other**. Build command: *(empty)*. Output directory: *(root)*.
4. Deploy.

Note: `vercel.json` enables clean URLs (`/services` instead of `/services.html`) — internal links using `.html` still work.

# Portfolio

Personal portfolio for Mohammad Shahnawaz. Static Astro site, deployed to GitHub Pages (user site, served from `/`) by `.github/workflows/deploy.yml` on push to `main`.

Design reference: @design.md. Its "Recommended Tech Stack" (Next.js, Framer Motion, Radix) is not used; keep the visual/interaction spec, implement it with plain Astro + CSS.

## Commands
- `npm run dev` — dev server
- `npm run build` — static build to `dist/` (this is what CI runs; must pass)
- `npm run preview` — serve `dist/`

## Structure
- `src/pages/index.astro` — home (hero, experience, projects, skills, highlights, latest blogs, footer)
- `src/pages/blogs/index.astro`, `src/pages/blogs/[slug].astro` — blog list and posts
- `src/pages/rss.xml.js` — RSS feed
- `src/content/blogs/*.md` — blog posts; schema in `src/content.config.ts`
- `src/layouts/Base.astro` — `<head>`, fonts, theme init, theme toggle, shared script
- `src/components/` — reusable pieces (blog list, etc.)
- `src/styles/global.css` — all styling, tokens as CSS variables (zinc scale, dark/light via `data-theme`)
- `src/scripts/main.js` — theme toggle, clock, scroll reveal, spy-scroll index, marquee
- `public/` — files served as-is (`profile.png`, resume PDF)

## Adding a blog post
Drop `src/content/blogs/<slug>.md` with frontmatter:
```
title: "..."
date: "YYYY-MM-DD"
tags: ["AI Agents"]
excerpt: "..."        # optional
```
Slug comes from the filename. Reading time is computed at build time.

## Conventions
- Minimal overhead: no UI framework, no client-side JS beyond `main.js`, no new dependencies without a reason.
- Content is static HTML rendered at build time; do not fetch data at runtime.
- Don't invent content (stats, links, roles). If a section needs data that isn't in the repo, ask.
- Keep light and dark themes working for every change.
- Commit in small, focused steps.

# Portfolio Website Overview (Agent Guide)

This document provides an overview of the portfolio website's architecture, mechanisms, design preferences, and technology stack. It is intended to help other AI agents understand the codebase and contribute effectively.

## Technology Stack
- **Core Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6 Modules)
- **Build Tool / Bundler:** Vite
- **Blog Pipeline Dependencies:** 
  - `gray-matter`: For parsing YAML frontmatter from Markdown files.
  - `marked`: For compiling Markdown to HTML.
- **Fonts:** Inter (Sans-serif), JetBrains Mono (Monospace)
- **Icons:** Inline SVGs

## Architecture & File Structure
- `index.html`: The main single-page portfolio layout featuring Hero, About, Experience, Projects, Skills, and Education sections.
- `styles.css`: The central stylesheet containing CSS variables for theme tokenization, fluid typography, and the "sheet" container layout.
- `script.js`: The main client-side script handling DOM interactivity.
- `vite.config.mjs`: Configuration for Vite, which explicitly includes the custom blog plugin and sets up Rollup inputs for `index.html` and `blogs/index.html`.
- `vite-plugin-md-blogs.mjs`: A custom, in-house Vite plugin handling the Markdown blog system (both Dev and Build steps).
- `blogs/`: Directory containing blog logic.
  - `blogs/index.html`: The blog listing page.
  - `blogs/blog-template.html`: The template HTML file into which markdown posts are injected.
  - `blogs/posts/`: Directory for placing `.md` blog posts.

## Core Mechanisms
1. **Theming System:** 
   - Managed via a `data-theme` attribute on the `<html>` tag (`light` or `dark`). 
   - State is persisted in `localStorage('theme')`.
   - `styles.css` uses CSS variables scoped to `[data-theme="dark"]` or `[data-theme="light"]` for instant theme switching.
2. **Custom Markdown Blog Pipeline:**
   - The custom Vite plugin (`vite-plugin-md-blogs.mjs`) scans `blogs/posts/*.md`.
   - **Dev Mode:** Intercepts server requests to dynamically serve the parsed markdown pages and a `posts-manifest.json` on the fly.
   - **Build Mode:** Pre-renders all markdown files into static HTML files inside `dist/blogs/<slug>/index.html` using the template. It also auto-derives missing metadata like excerpts and read-times based on content.
3. **Interactive Components (`script.js`):**
   - **MCP Console Logic:** Simulates an interactive Model Context Protocol terminal on the UI where tool outputs (like `get_skills`) are appended dynamically with artificial network delays.
   - **Scroll Animations:** Uses `IntersectionObserver` to reveal elements (fade-in & slide-up) as they enter the viewport.
   - **Horizontal Slider:** Manages horizontal scrolling for the Projects section with auto-updating navigation buttons.

## Design Preferences & Principles
- **Aesthetic:** Developer-focused, minimalist, and "terminal/monospace" aesthetic.
- **Layout Model:** Uses a "sheet container" bounded by vertical borders (max-width constrained) centered on the page, sitting above a textured background.
- **Backgrounds:** Uses radial gradients combined with a textured grain noise overlay (SVG filter generated via CSS) for a tactile feel.
- **Interactions:** Subtle and constrained. Hover states usually involve border color shifts or subtle background highlighting (`--accent-subtle`). 
- **Dependencies:** Avoids heavy UI frameworks (no React, Vue, or Tailwind) to maintain an ultra-lightweight footprint and demonstrate strong fundamentals.

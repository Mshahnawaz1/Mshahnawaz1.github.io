# Portfolio Design Specification

## 1. Overview
This document outlines the design and architectural specifications for the portfolio website, heavily inspired by [Ashutoshx7's portfolio](https://www.ashutoshx7.me/). The goal is to build a modern, developer-focused, highly interactive, and visually clean personal website with a terminal-like, retro-futuristic aesthetic blended with modern minimalism.

## 2. Typography & Theming
- **Primary Font**: Geist Sans (for headings and body text).
- **Monospace Font**: Geist Mono (for code snippets, tags, and technical details).
- **Display Font**: Doto (for specific elements like the digital clock widget).
- **Color Palette**: 
  - Monochromatic base using Tailwind's `zinc` and `neutral` scales.
  - Deep black for Dark Mode (`#000000` or `zinc-950`).
  - Crisp white for Light Mode (`#ffffff` or `zinc-50`).
- **Dark/Light Mode**: First-class support for both themes with smooth transitions (`transition-colors duration-300`).

## 3. Layout & Global UI Elements
- **Main Container**: A centered, fixed-width content column on desktop (e.g., `md:left-[30%] md:right-[30%]`), mimicking a sleek document or terminal window.
- **Background Effects**:
  - Dotted grid lines defining the borders of the main container using `mask-image: repeating-linear-gradient`.
  - Subtle noise or canvas background overlay.
- **Fixed Navigation (Index)**: A vertical, spy-scroll navigation menu pinned to the side on large screens (links to `#experience`, `#projects`, `#opensource`, `#skills`, `#blogs`, `#highlights`).
- **Digital Clock**: A fixed widget in the bottom-right corner displaying the current local time in a retro, monospace format (e.g., `00:00:00`).

## 4. Content Sections

### 4.1. Hero Section
- **Avatar**: A stylized profile picture (e.g., grayscale, contrast-adjusted, with a mix-blend mode for a subtle glitch or printed look).
- **Headline**: Name and Age, featuring a subtle text-shadow or glowing effect.
- **Bio**: Short, punchy tagline ("Engineer / Artist. I love building, breaking, and shipping things.").
- **Call to Action**: A custom, interactive 3D flip-cover button for booking an intro call (e.g., Cal.com/Calendly integration) and sending an email.
- **Socials**: Pill-shaped links (GitHub, Twitter, LinkedIn, Discord) with glassmorphic (`backdrop-filter: blur`) and hover-glow effects.

### 4.2. Experience
- A vertical timeline or list view.
- Each item includes: Title, Company, Date, Location, a list of bullet points detailing responsibilities and impact, and pill-shaped tags for technologies used.
- Hover effects on experience cards with subtle background highlight (`hover:bg-zinc-50` / `dark:hover:bg-zinc-900/20`).

### 4.3. Projects
- Grid or list of project cards.
- Each card features:
  - Video preview or high-quality thumbnail.
  - Status indicator (e.g., "Live", "Building", "Not Started").
  - Title, short description, and a "View Project" button.

### 4.4. Open Source & GitHub Activity
- **Contribution Heatmap**: A visual calendar component showing GitHub activity over the last year.
- **Stats**: Quick metrics showing merged PRs, open PRs, and repositories contributed to.

### 4.5. Skills & Technologies
- A clean masonry grid or flex-wrap container displaying technology icons and names (React, Next.js, Python, PostgreSQL, etc.).

### 4.6. Blogs
- Minimalist list of articles displaying the title, publish date, and category tags.

### 4.7. Highlights / Achievements
- An infinite scrolling marquee or grid displaying notable achievements (e.g., GSoC, hackathon wins, program acceptances).

### 4.8. Footer
- A bold, inspirational quote to close out the page (e.g., *"Do so much work that it would be unreasonable for you to not be successful."*).

## 5. Animations & Interactions
- **Micro-interactions**: Scale-down on active (`active:scale-95`), smooth opacity fades on hover.
- **Glassmorphism**: Use of translucent backgrounds with blur effects on floating elements like buttons and the nav.
- **Scroll Reveal**: Elements should subtly fade and slide in as they enter the viewport.

## 6. Recommended Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion & GSAP
- **Components**: Radix UI or shadcn/ui for accessible base components (Command Palette, Dialogs).
- **Icons**: Lucide React or simple SVGs.

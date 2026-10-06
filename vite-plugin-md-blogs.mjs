/**
 * vite-plugin-md-blogs.mjs
 *
 * Build-time + dev-time plugin that:
 *  1. Scans `blogs/posts/*.md` for all markdown files
 *  2. Parses YAML frontmatter (gray-matter) + converts body to HTML (marked)
 *  3. Auto-derives `slug` from filename, `readTime` from word count, `excerpt`
 *     from the first paragraph if not provided in frontmatter
 *  4. In BUILD: renders each post through `blogs/blog-template.html` → writes
 *     to `dist/blogs/<slug>/index.html` as a real static page, and writes
 *     `dist/blogs/posts-manifest.json`
 *  5. In DEV: serves `posts-manifest.json` and `blogs/<slug>/index.html`
 *     dynamically from the `.md` files so `npm run dev` works without building.
 *
 * To add a new blog post: drop a `.md` file in `blogs/posts/` and rebuild
 * (or just save & refresh in dev mode).
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, basename } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// ── Helpers ────────────────────────────────────────────────────────────────

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function calcReadTime(markdown) {
  const words = countWords(markdown.replace(/```[\s\S]*?```/g, '').replace(/#+ /g, ''));
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function deriveExcerpt(html, maxChars = 200) {
  const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function escapeAttr(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Read and process all .md files in postsDir, return { manifest, posts } */
function processMarkdownPosts(postsDir, templateSrc, blogsJsonPath) {
  const mdFiles = readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  const manifest = [];
  const posts = {}; // slug → rendered HTML
  const seenSlugs = new Set();

  for (const file of mdFiles) {
    const slug = basename(file, '.md');
    const raw  = readFileSync(resolve(postsDir, file), 'utf-8');
    const { data, content } = matter(raw);

    const readTime  = data.readTime ?? calcReadTime(content);
    const bodyHtml  = marked.parse(content);
    const excerpt   = data.excerpt ?? deriveExcerpt(bodyHtml);
    const dateLabel = formatDate(data.date);

    // Support both `tags: [...]` array and single `tag:` string in frontmatter
    const tags = Array.isArray(data.tags)
      ? data.tags
      : (data.tag ? String(data.tag).split(',').map(t => t.trim()) : ['General']);

    manifest.push({
      slug,
      title:     data.title,
      excerpt,
      tag:       data.tag ?? 'General',
      tags,
      date:      data.date,
      dateLabel,
      readTime,
    });
    seenSlugs.add(slug);

    if (templateSrc) {
      posts[slug] = templateSrc
        .replace(/{{SLUG}}/g,       slug)
        .replace(/{{TITLE}}/g,      escapeAttr(data.title))
        .replace(/{{DATE}}/g,       data.date)
        .replace(/{{DATE_LABEL}}/g, dateLabel)
        .replace(/{{TAG}}/g,        escapeAttr(data.tag ?? 'General'))
        .replace(/{{READ_TIME}}/g,  escapeAttr(readTime))
        .replace(/{{EXCERPT}}/g,    escapeAttr(excerpt))
        .replace(/{{BODY_HTML}}/g,  bodyHtml);
    }
  }

  // Merge metadata-only stubs from blogs.json for posts without markdown yet
  if (blogsJsonPath) {
    try {
      const blogsJson = JSON.parse(readFileSync(blogsJsonPath, 'utf-8'));
      for (const entry of blogsJson) {
        if (seenSlugs.has(entry.slug)) continue; // MD file takes precedence
        const tags = Array.isArray(entry.tags)
          ? entry.tags
          : (entry.tag ? String(entry.tag).split(',').map(t => t.trim()) : ['General']);
        manifest.push({
          slug:      entry.slug,
          title:     entry.title,
          excerpt:   entry.excerpt ?? '',
          tag:       entry.tag ?? 'General',
          tags,
          date:      entry.date,
          dateLabel: entry.dateLabel ?? formatDate(entry.date),
          readTime:  entry.readTime ?? '',
        });
      }
    } catch (e) {
      // blogs.json missing or malformed — silently skip
    }
  }

  manifest.sort((a, b) => b.date.localeCompare(a.date));
  return { manifest, posts };
}

// ── Plugin ─────────────────────────────────────────────────────────────────

export default function mdBlogsPlugin() {
  let postsDir;
  let templatePath;
  let blogsJsonPath;
  let outDir;
  let root;

  return {
    name: 'vite-plugin-md-blogs',

    configResolved(config) {
      root          = config.root;
      postsDir      = resolve(root, 'blogs/posts');
      templatePath  = resolve(root, 'blogs/blog-template.html');
      blogsJsonPath = resolve(root, 'blogs/blogs.json');
      outDir        = resolve(root, config.build.outDir ?? 'dist');
    },

    // ── DEV SERVER: serve manifest + post pages dynamically ──────────────
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];

        // Serve: /blogs/posts-manifest.json
        if (url === '/blogs/posts-manifest.json') {
          try {
            const { manifest } = processMarkdownPosts(postsDir, null, blogsJsonPath);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(manifest, null, 2));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
          return;
        }

        // Serve: /blogs/<slug>/ or /blogs/<slug>/index.html
        const postMatch = url.match(/^\/blogs\/([^/]+)\/?(?:index\.html)?$/);
        if (postMatch) {
          const slug = postMatch[1];
          if (slug === '' || slug === 'index.html') return next(); // listing page
          try {
            const templateSrc = readFileSync(templatePath, 'utf-8');
            const { posts } = processMarkdownPosts(postsDir, templateSrc, blogsJsonPath);
            if (posts[slug]) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(posts[slug]);
              return;
            }
          } catch (err) {
            console.error('[md-blogs dev]', err);
          }
        }

        next();
      });
    },

    // ── BUILD: write static HTML + manifest to dist ───────────────────────
    closeBundle() {
      const templateSrc = readFileSync(templatePath, 'utf-8');
      const { manifest, posts } = processMarkdownPosts(postsDir, templateSrc, blogsJsonPath);

      for (const [slug, html] of Object.entries(posts)) {
        const postOutDir = resolve(outDir, 'blogs', slug);
        mkdirSync(postOutDir, { recursive: true });
        writeFileSync(resolve(postOutDir, 'index.html'), html, 'utf-8');
        console.log(`[md-blogs] ✓ ${slug}`);
      }

      const manifestOut = resolve(outDir, 'blogs', 'posts-manifest.json');
      writeFileSync(manifestOut, JSON.stringify(manifest, null, 2), 'utf-8');
      console.log(`[md-blogs] Manifest → ${manifest.length} post(s)`);
    },
  };
}

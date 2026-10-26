const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHTML = (str) =>
    String(str ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/* Theme toggle (initial theme is set by the inline script in <head>) */
$('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
});

/* Digital clock */
const clock = $('#clock');
if (clock) {
    const tick = () => (clock.textContent = new Date().toLocaleTimeString('en-GB'));
    tick();
    setInterval(tick, 1000);
}

/* Scroll reveal */
const revealer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        revealer.unobserve(entry.target);
    }
}, { threshold: 0.05 });

$$('section, .hero > *, footer').forEach((el) => {
    el.classList.add('reveal');
    revealer.observe(el);
});

/* Spy-scroll index */
const indexLinks = $$('#index a');
if (indexLinks.length) {
    const spy = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            indexLinks.forEach((a) => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
        }
    }, { rootMargin: '-40% 0px -55% 0px' });
    indexLinks.forEach((a) => spy.observe($(a.hash)));
}

/* Highlights marquee: duplicate the track for a seamless loop */
const track = $('#marquee-track');
if (track) {
    track.append(...[...track.children].map((card) => {
        const copy = card.cloneNode(true);
        copy.setAttribute('aria-hidden', 'true');
        return copy;
    }));
}

/* Blog list: rendered from the build-time manifest (see vite-plugin-md-blogs.mjs) */
const blogList = $('#blog-list');
if (blogList) {
    const base = location.pathname.includes('/blogs') ? './' : 'blogs/';
    fetch(`${base}posts-manifest.json`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((posts) => {
            const shown = posts.slice(0, Number(blogList.dataset.limit) || posts.length);
            blogList.innerHTML = shown.length
                ? shown.map((post) => `
                    <a class="blog-row" href="${base}${escapeHTML(post.slug)}/">
                        <span class="blog-title">${escapeHTML(post.title)}</span>
                        <span class="blog-meta">
                            <time class="meta" datetime="${escapeHTML(post.date)}">${escapeHTML(post.dateLabel)}</time>
                            ${(post.tags ?? []).map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
                        </span>
                    </a>`).join('')
                : '<p class="empty">No articles yet.</p>';
        })
        .catch(() => (blogList.innerHTML = '<p class="empty">Could not load articles.</p>'));
}

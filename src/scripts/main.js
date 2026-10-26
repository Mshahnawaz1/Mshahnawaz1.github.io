const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

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

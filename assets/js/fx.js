/*
 * fx.js — the small amount of motion and liveness the redesign adds.
 * Independent of components/i18n/main: it only touches elements that exist
 * on the page it runs on, and every effect degrades to nothing.
 *
 *   #nn-canvas     home hero: a k-nearest-neighbour graph you steer with the cursor
 *   #bud-clock     footer: live Budapest time
 *   .grid-mock     home: flip the sample Anidle round when it scrolls into view
 *   .read-progress project/blog pages: reading progress bar
 *   "/"            focuses the search box
 */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Budapest clock ------------------------------------------------ */
    function startClock() {
        var el = document.getElementById('bud-clock');
        if (!el) return;
        var fmt;
        try {
            fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Budapest' });
        } catch (e) { return; }
        function tick() { el.textContent = fmt.format(new Date()); }
        tick();
        setInterval(tick, 15000);
    }

    /* ---- "/" focuses search -------------------------------------------- */
    document.addEventListener('keydown', function (e) {
        if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        var box = document.getElementById('site-search');
        if (box && box.offsetParent !== null) { e.preventDefault(); box.focus(); }
    });

    /* ---- sample round -------------------------------------------------- */
    function watchGridMock() {
        var mock = document.querySelector('.grid-mock');
        if (!mock) return;
        if (!('IntersectionObserver' in window)) { mock.classList.add('is-visible'); return; }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { mock.classList.add('is-visible'); io.disconnect(); }
            });
        }, { threshold: 0.35 });
        io.observe(mock);
    }

    /* ---- reading progress ---------------------------------------------- */
    function readProgress() {
        var bar = document.querySelector('.read-progress');
        if (!bar) return;
        function update() {
            var h = document.documentElement;
            var max = h.scrollHeight - h.clientHeight;
            bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ')';
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ---- hero: k-NN field ---------------------------------------------- */
    function neighbourField() {
        var canvas = document.getElementById('nn-canvas');
        if (!canvas || !canvas.getContext) return;
        var hero = canvas.parentElement;
        var readout = document.getElementById('nn-names');
        var ctx = canvas.getContext('2d');

        var WORDS = ['Rust', 'Python', 'embeddings', 'FAISS', 'Go', 'Redis', 'Kafka', 'Spark',
            'Docker', 'React', 'SQL', 'TensorFlow', 'FastAPI', 'pandas', 'Postgres', 'Kotlin',
            'MMR', 'cosine', 'Jaccard', 'k-NN', 'IFRS 9', 'credit risk', 'Slay the Spire',
            'recommender', 'Anidle', 'Android', 'FFmpeg', 'Ollama', 'TTS', 'ranking',
            'graphs', 'VaR', 'Budapest', 'ELTE', 'Berlin', 'R', 'Jupyter', 'Next.js'];
        var K = 5;
        var w = 0, h = 0, dpr = 1;
        var nodes = [];
        var colors = {};
        var pointer = { x: 0, y: 0, active: false };
        var raf = 0, running = false, t0 = performance.now();
        var lastNames = '';

        function readColors() {
            var cs = getComputedStyle(document.documentElement);
            colors.accent = cs.getPropertyValue('--accent').trim() || '#c8f751';
            colors.text = cs.getPropertyValue('--text-color').trim() || '#f1f0ea';
            colors.muted = cs.getPropertyValue('--text-muted-color').trim() || '#94968f';
        }

        function seed() {
            var count = Math.round(Math.min(WORDS.length, Math.max(18, (w * h) / 26000)));
            nodes = [];
            for (var i = 0; i < count; i++) {
                nodes.push({
                    label: WORDS[i],
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22
                });
            }
        }

        function resize() {
            var r = hero.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            var pw = w, ph = h;
            w = Math.max(1, Math.round(r.width));
            h = Math.max(1, Math.round(r.height));
            if (nodes.length && pw > 1 && ph > 1) {
                nodes.forEach(function (n) { n.x *= w / pw; n.y *= h / ph; });
            }
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!nodes.length || pw <= 1) seed();
            if (!running) draw(performance.now());
        }

        function query(now) {
            if (pointer.active) return pointer;
            var t = (now - t0) / 1000;
            return { x: w * (0.66 + 0.24 * Math.sin(t * 0.37)), y: h * (0.36 + 0.24 * Math.sin(t * 0.53 + 1.3)) };
        }

        function draw(now) {
            ctx.clearRect(0, 0, w, h);
            var q = query(now);
            var i, j, n, m, dx, dy, d;

            if (!reduceMotion) {
                for (i = 0; i < nodes.length; i++) {
                    n = nodes[i];
                    n.x += n.vx; n.y += n.vy;
                    if (n.x < 0 || n.x > w) n.vx *= -1;
                    if (n.y < 0 || n.y > h) n.vy *= -1;
                }
            }

            // faint proximity edges
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors.muted;
            for (i = 0; i < nodes.length; i++) {
                for (j = i + 1; j < nodes.length; j++) {
                    dx = nodes[i].x - nodes[j].x; dy = nodes[i].y - nodes[j].y;
                    d = dx * dx + dy * dy;
                    if (d < 16900) {
                        ctx.globalAlpha = 0.22 * (1 - d / 16900);
                        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                    }
                }
            }

            // k nearest to the query point
            var ranked = nodes.map(function (nd) {
                var ex = nd.x - q.x, ey = nd.y - q.y;
                return { nd: nd, d: ex * ex + ey * ey };
            }).sort(function (a, b) { return a.d - b.d; }).slice(0, K);
            var isNN = {};
            ranked.forEach(function (r) { isNN[r.nd.label] = true; });

            ctx.font = '11px "Space Mono", ui-monospace, monospace';
            ctx.textBaseline = 'middle';
            for (i = 0; i < nodes.length; i++) {
                n = nodes[i];
                if (isNN[n.label]) continue;
                ctx.globalAlpha = 0.45;
                ctx.fillStyle = colors.muted;
                ctx.fillRect(n.x - 2, n.y - 2, 4, 4);
                ctx.globalAlpha = 0.5;
                ctx.fillText(n.label, n.x + 8, n.y);
            }

            ctx.globalAlpha = 1;
            ctx.strokeStyle = colors.accent;
            ctx.fillStyle = colors.accent;
            ctx.lineWidth = 1.4;
            ranked.forEach(function (r, idx) {
                ctx.globalAlpha = 0.95 - idx * 0.12;
                ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(r.nd.x, r.nd.y); ctx.stroke();
                ctx.fillRect(r.nd.x - 4, r.nd.y - 4, 8, 8);
                ctx.font = '700 12px "Space Mono", ui-monospace, monospace';
                ctx.fillText(r.nd.label, r.nd.x + 12, r.nd.y);
            });

            // the query itself: a crosshair
            ctx.globalAlpha = 1;
            ctx.lineWidth = 1.6;
            ctx.beginPath(); ctx.arc(q.x, q.y, 9, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(q.x - 16, q.y); ctx.lineTo(q.x - 5, q.y);
            ctx.moveTo(q.x + 5, q.y); ctx.lineTo(q.x + 16, q.y);
            ctx.moveTo(q.x, q.y - 16); ctx.lineTo(q.x, q.y - 5);
            ctx.moveTo(q.x, q.y + 5); ctx.lineTo(q.x, q.y + 16);
            ctx.stroke();
            ctx.globalAlpha = 1;

            if (readout) {
                var names = ranked.map(function (r) { return r.nd.label; }).join(' · ');
                if (names !== lastNames) { readout.textContent = names; lastNames = names; }
            }
        }

        function loop(now) {
            draw(now);
            raf = requestAnimationFrame(loop);
        }
        function start() { if (!running && !reduceMotion) { running = true; raf = requestAnimationFrame(loop); } }
        function stop() { running = false; cancelAnimationFrame(raf); }

        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true;
            if (reduceMotion) draw(performance.now());
        });
        hero.addEventListener('pointerleave', function () { pointer.active = false; });

        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
        else window.addEventListener('resize', resize);

        new MutationObserver(function () { readColors(); if (!running) draw(performance.now()); })
            .observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(hero);
        } else start();
        document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

        readColors();
        resize();
        start();
    }

    function init() {
        startClock();
        watchGridMock();
        readProgress();
        neighbourField();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

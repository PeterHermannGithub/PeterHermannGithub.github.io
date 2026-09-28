/*
 * neighbours.js — Neighbours, a ten-round game against the similarity formula.
 *
 * Each round shows a title and four candidates; pick the one the V2 formula
 * (tag 60 / score 20 / year 15 / type 5, from anime-data.js) ranks closest.
 * The reveal shows the actual scores, so you learn what the formula rewards.
 */
(function () {
    'use strict';
    var A = window.ANIME;
    var root = document.getElementById('nb-root');
    if (!A || !root) return;

    var ROUNDS = 10;
    var STR = {
        en: { round: 'Round', of: 'of', prompt: 'Which of these is closest to', next: 'Next round', finish: 'See result', again: 'Play again', done: 'Final score', correct: 'Correct.', wrong: 'The formula prefers ', shared: 'shared', none: 'no shared tags', best: 'Best', verdictHi: 'You think like the formula.', verdictMid: 'You have the tags, not the arithmetic.', verdictLo: 'Your taste and the formula disagree. That is allowed.' },
        hu: { round: 'Kör', of: '/', prompt: 'Melyik van a legközelebb ehhez:', next: 'Következő kör', finish: 'Eredmény', again: 'Újra', done: 'Végeredmény', correct: 'Helyes.', wrong: 'A képlet ezt szereti jobban: ', shared: 'közös', none: 'nincs közös címke', best: 'Legjobb', verdictHi: 'Úgy gondolkodsz, mint a képlet.', verdictMid: 'A címkék megvannak, a számolás nem.', verdictLo: 'Az ízlésed és a képlet nem ért egyet. Ez megengedett.' }
    };
    function lang() { return document.documentElement.lang === 'hu' ? 'hu' : 'en'; }
    function t(k) { return STR[lang()][k]; }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

    var state;
    function best() { try { return +localStorage.getItem('nb-best') || 0; } catch (e) { return 0; } }
    function saveBest(n) { try { localStorage.setItem('nb-best', String(n)); } catch (e) {} }

    function newRound() {
        var D = A.DATA;
        var base = D[Math.floor(Math.random() * D.length)];
        var ranked = D.filter(function (d) { return d.i !== base.i; }).map(function (d) { return { d: d, r: A.sim(base, d) }; })
            .sort(function (x, y) { return y.r.sum - x.r.sum; });
        // the answer is in the top 3; distractors come from the middle and bottom so a round is never a coin flip
        var answer = ranked[Math.floor(Math.random() * 3)];
        var pool = shuffle(ranked.slice(8).slice());
        var opts = shuffle([answer].concat(pool.slice(0, 3)));
        // the true best is the highest-scoring option actually shown
        var top = opts.reduce(function (a, b) { return b.r.sum > a.r.sum ? b : a; });
        return { base: base, opts: opts, top: top, picked: null };
    }

    function start() { state = { n: 0, score: 0, round: newRound(), done: false }; draw(); }

    function draw() {
        root.innerHTML = '';
        if (state.done) return drawEnd();
        var r = state.round;
        var head = el('div', 'nb-head');
        head.appendChild(el('span', 'ex-label', t('round') + ' ' + (state.n + 1) + ' ' + t('of') + ' ' + ROUNDS));
        head.appendChild(el('span', 'ex-label', state.score + ' / ' + state.n));
        root.appendChild(head);
        root.appendChild(el('p', 'nb-prompt', t('prompt')));
        var h = el('h2', 'nb-title', r.base.title);
        root.appendChild(h);
        root.appendChild(el('p', 'nb-meta', r.base.year + ' · ' + r.base.type + ' · ' + r.base.tags.join(' · ')));

        var list = el('div', 'nb-opts');
        r.opts.forEach(function (o) {
            var b = el('button', 'nb-opt');
            b.type = 'button';
            b.appendChild(el('strong', null, o.d.title));
            b.appendChild(el('span', 'nb-ometa', o.d.year + ' · ' + o.d.type + ' · ' + o.d.tags.join(' · ')));
            if (r.picked) {
                b.disabled = true;
                var isTop = o === r.top;
                if (isTop) b.classList.add('is-top');
                if (o === r.picked && !isTop) b.classList.add('is-wrong');
                var pct = el('em', 'nb-pct', (o.r.sum * 100).toFixed(0) + '%');
                b.appendChild(pct);
                b.appendChild(el('span', 'nb-shared', o.r.shared.length ? t('shared') + ': ' + o.r.shared.join(' · ') : t('none')));
            } else {
                b.addEventListener('click', function () { pick(o); });
            }
            list.appendChild(b);
        });
        root.appendChild(list);

        if (r.picked) {
            var ok = r.picked === r.top;
            root.appendChild(el('p', 'nb-verdict ' + (ok ? 'ok' : 'no'), ok ? t('correct') : t('wrong') + r.top.d.title + '.'));
            var nx = el('button', 'btn btn-primary', state.n + 1 === ROUNDS ? t('finish') : t('next'));
            nx.type = 'button';
            nx.addEventListener('click', function () {
                state.n++;
                if (state.n === ROUNDS) { state.done = true; if (state.score > best()) saveBest(state.score); }
                else state.round = newRound();
                draw();
            });
            root.appendChild(nx);
            nx.focus();
        }
    }

    function pick(o) {
        state.round.picked = o;
        if (o === state.round.top) state.score++;
        draw();
    }

    function drawEnd() {
        root.appendChild(el('p', 'ex-label', t('done')));
        root.appendChild(el('div', 'nb-final', state.score + ' / ' + ROUNDS));
        var v = state.score >= 8 ? 'verdictHi' : (state.score >= 5 ? 'verdictMid' : 'verdictLo');
        root.appendChild(el('p', 'nb-verdict', t(v)));
        root.appendChild(el('p', 'ex-label', t('best') + ': ' + best() + ' / ' + ROUNDS));
        var b = el('button', 'btn btn-primary', t('again'));
        b.type = 'button'; b.addEventListener('click', start);
        root.appendChild(b);
    }

    start();
    ['lang-toggle', 'mobile-lang-toggle'].forEach(function (id) {
        var b = document.getElementById(id); if (b) b.addEventListener('click', function () { setTimeout(draw, 30); });
    });
})();

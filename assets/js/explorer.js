/*
 * explorer.js — a toy of the recommender's V2 similarity formula.
 *
 * The real engine scored 37,030 titles pairwise (649M pairs) with the weights
 * tag 60% / score 20% / year 15% / type 5%. This does the same arithmetic on 40
 * hand-tagged titles (anime-data.js, which must load first) so you can move the weights
 * and watch the neighbours change.
 *
 * Mounts into #explorer-root. Independent of the other site scripts; it carries its own
 * EN/HU strings and re-renders when a language toggle is clicked.
 */
(function () {
    'use strict';
    var root = document.getElementById('explorer-root');
    if (!root) return;

    var A = window.ANIME;
    if (!A) return;
    var DATA = A.DATA, PARTS = A.PARTS, W_DEFAULT = A.W_DEFAULT;

    var STR = {
        en: {
            pick: 'Pick a title', random: 'Random', weights: 'Weights', tag: 'tags', score: 'score', year: 'year', type: 'type',
            nearest: 'Nearest neighbours', shared: 'shared', none: 'no shared tags', reset: 'Reset to V2 weights',
            foot: 'A toy: 40 hand-tagged titles, rounded illustrative scores. The real engine ran this arithmetic over 37,030 titles and 649 million pairs in 16 minutes.'
        },
        hu: {
            pick: 'Válassz egy címet', random: 'Véletlen', weights: 'Súlyok', tag: 'címkék', score: 'pontszám', year: 'év', type: 'típus',
            nearest: 'Legközelebbi szomszédok', shared: 'közös', none: 'nincs közös címke', reset: 'Vissza a V2 súlyokhoz',
            foot: 'Játék: 40 kézzel címkézett cím, kerekített, szemléltető pontszámokkal. A valódi motor ugyanezt a számítást végezte 37 030 címen és 649 millió páron, 16 perc alatt.'
        }
    };
    function lang() { return document.documentElement.lang === 'hu' ? 'hu' : 'en'; }
    function t(k) { return STR[lang()][k]; }

    var state = { sel: 1, w: Object.assign({}, W_DEFAULT) };

    function rank() {
        var a = DATA[state.sel];
        return DATA.filter(function (d) { return d.i !== a.i; }).map(function (d) {
            var r = A.sim(a, d, state.w);
            return { d: d, c: r.c, sum: r.sum, shared: r.shared };
        }).sort(function (x, y) { return y.sum - x.sum; }).slice(0, 8);
    }

    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    function render() {
        root.innerHTML = '';
        var top = el('div', 'ex-top');

        var pickWrap = el('label', 'ex-field');
        pickWrap.appendChild(el('span', 'ex-label', t('pick')));
        var select = el('select', 'ex-select');
        DATA.forEach(function (d) {
            var o = el('option', null, d.title + ' (' + d.year + ')');
            o.value = d.i; if (d.i === state.sel) o.selected = true;
            select.appendChild(o);
        });
        select.addEventListener('change', function () { state.sel = +select.value; render(); });
        pickWrap.appendChild(select);
        top.appendChild(pickWrap);

        var rnd = el('button', 'btn', t('random'));
        rnd.type = 'button';
        rnd.addEventListener('click', function () {
            var n; do { n = Math.floor(Math.random() * DATA.length); } while (n === state.sel);
            state.sel = n; render();
        });
        top.appendChild(rnd);
        root.appendChild(top);

        var sliders = el('div', 'ex-weights');
        sliders.appendChild(el('span', 'ex-label', t('weights')));
        PARTS.forEach(function (k) {
            var row = el('label', 'ex-slider');
            var name = el('span', 'ex-sname ex-c-' + k, t(k));
            var val = el('output', 'ex-sval', state.w[k] + '');
            var inp = el('input');
            inp.type = 'range'; inp.min = 0; inp.max = 100; inp.step = 5; inp.value = state.w[k];
            inp.setAttribute('aria-label', t(k));
            inp.addEventListener('input', function () {
                state.w[k] = +inp.value; val.textContent = inp.value; paintResults();
            });
            row.appendChild(name); row.appendChild(inp); row.appendChild(val);
            sliders.appendChild(row);
        });
        var reset = el('button', 'ex-reset', t('reset'));
        reset.type = 'button';
        reset.addEventListener('click', function () { state.w = Object.assign({}, W_DEFAULT); render(); });
        sliders.appendChild(reset);
        root.appendChild(sliders);

        root.appendChild(el('p', 'ex-label ex-nn', t('nearest')));
        var list = el('ol', 'ex-list');
        list.id = 'ex-list';
        root.appendChild(list);
        root.appendChild(el('p', 'ex-foot', t('foot')));
        paintResults();
    }

    function paintResults() {
        var list = document.getElementById('ex-list');
        if (!list) return;
        list.innerHTML = '';
        rank().forEach(function (r) {
            var li = el('li', 'ex-row');
            var head = el('div', 'ex-head');
            head.appendChild(el('strong', null, r.d.title));
            head.appendChild(el('span', 'ex-meta', r.d.year + ' · ' + r.d.type));
            head.appendChild(el('span', 'ex-pct', (r.sum * 100).toFixed(0) + '%'));
            li.appendChild(head);
            var bar = el('div', 'ex-bar');
            PARTS.forEach(function (k) {
                var seg = el('i', 'ex-c-' + k);
                seg.style.width = (r.c[k] * 100).toFixed(1) + '%';
                bar.appendChild(seg);
            });
            li.appendChild(bar);
            li.appendChild(el('span', 'ex-shared', r.shared.length ? t('shared') + ': ' + r.shared.join(' · ') : t('none')));
            list.appendChild(li);
        });
    }

    render();
    ['lang-toggle', 'mobile-lang-toggle'].forEach(function (id) {
        var b = document.getElementById(id);
        if (b) b.addEventListener('click', function () { setTimeout(render, 30); });
    });
})();

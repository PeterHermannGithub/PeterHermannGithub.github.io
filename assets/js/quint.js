/*
 * quint.js — Quint, a five-letter guessing game with a closed vocabulary.
 *
 * Unlike Wordle you may only guess words from the bank (shown on the page), so
 * the game is about elimination, not spelling luck. One word a day, chosen by
 * the local date; "Random" plays any word. Stats live in localStorage only.
 */
(function () {
    'use strict';

    var BANK = ('model batch epoch layer graph query index token tuple float array stack cache queue proxy shard merge patch build debug ' +
        'logic input table field split score class trait value range slice alias async await break catch const yield macro crate bytes ' +
        'ratio prior prune noise drift guard chain event error state mutex parse regex clone trace frame pixel curve sigma delta gamma ' +
        'alpha theta omega nodes edges paths trees cycle route shell cloud fetch learn train valid boost fuzzy lasso ridge check solve ' +
        'proof rules sweep union stage tests probe stats basis prime power upper lower shift mixed guess vault pivot ' +
        'flush fault crash panic retry timer clock local cores ' +
        'skips trims joins views locks hooks binds nulls empty count where whole limit scope owner match loops ' +
        'tasks flags masks codec image audio video sound voice story quote plots lines').split(/\s+/)
        .filter(function (w) { return /^[a-z]{5}$/.test(w); })
        .filter(function (w, i, a) { return a.indexOf(w) === i; });

    var ROWS = 6, LEN = 5;
    var KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    var board = document.getElementById('quint-board');
    var keyboard = document.getElementById('quint-keys');
    var msg = document.getElementById('quint-msg');
    var bankEl = document.getElementById('quint-bank');
    var statsEl = document.getElementById('quint-stats');
    if (!board) return;

    var answer, guesses, current, over, mode, keyState;
    var lang = function () { return document.documentElement.lang === 'hu' ? 'hu' : 'en'; };
    var STR = {
        en: { short: 'Five letters, please.', unknown: 'Not in the bank.', win: 'Solved in ', lose: 'The word was ', tries: ' guesses', daily: 'Daily', random: 'Random', played: 'played', won: 'won', streak: 'streak', best: 'best', copied: 'Copied.', share: 'Copy result', again: 'Again' },
        hu: { short: 'Öt betű kell.', unknown: 'Nincs a szólistában.', win: 'Megfejtve ennyi tippből: ', lose: 'A szó ez volt: ', tries: '', daily: 'Napi', random: 'Véletlen', played: 'játszott', won: 'nyert', streak: 'sorozat', best: 'legjobb', copied: 'Kimásolva.', share: 'Eredmény másolása', again: 'Újra' }
    };
    function t(k) { return STR[lang()][k]; }

    function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
    function dailyWord() { return BANK[hash('quint:' + today()) % BANK.length]; }

    function load() { try { return JSON.parse(localStorage.getItem('quint') || '{}'); } catch (e) { return {}; } }
    function save(o) { try { localStorage.setItem('quint', JSON.stringify(o)); } catch (e) {} }

    function score(guess, ans) {
        var res = [], pool = {}, i;
        for (i = 0; i < LEN; i++) res.push('miss');
        for (i = 0; i < LEN; i++) {
            if (guess[i] === ans[i]) res[i] = 'hit'; else pool[ans[i]] = (pool[ans[i]] || 0) + 1;
        }
        for (i = 0; i < LEN; i++) {
            if (res[i] === 'hit') continue;
            if (pool[guess[i]]) { res[i] = 'near'; pool[guess[i]]--; }
        }
        return res;
    }

    function buildBoard() {
        board.innerHTML = '';
        for (var r = 0; r < ROWS; r++) {
            var row = document.createElement('div'); row.className = 'q-row';
            for (var c = 0; c < LEN; c++) { var cell = document.createElement('div'); cell.className = 'q-cell'; row.appendChild(cell); }
            board.appendChild(row);
        }
    }
    function buildKeys() {
        keyboard.innerHTML = '';
        KEYS.forEach(function (line, li) {
            var row = document.createElement('div'); row.className = 'q-krow';
            if (li === 2) row.appendChild(mkKey('Enter', 'enter', true));
            line.split('').forEach(function (ch) { row.appendChild(mkKey(ch, ch)); });
            if (li === 2) row.appendChild(mkKey('⌫', 'back', true));
            keyboard.appendChild(row);
        });
    }
    function mkKey(label, val, wide) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'q-key' + (wide ? ' wide' : ''); b.textContent = label; b.dataset.k = val;
        b.setAttribute('aria-label', val === 'back' ? 'Backspace' : val);
        return b;
    }
    function buildBank() {
        bankEl.innerHTML = '';
        BANK.slice().sort().forEach(function (w) {
            var s = document.createElement('span'); s.textContent = w; s.dataset.w = w; bankEl.appendChild(s);
        });
    }

    function paint() {
        var rows = board.children;
        for (var r = 0; r < ROWS; r++) {
            var word = r < guesses.length ? guesses[r] : (r === guesses.length ? current : '');
            var res = r < guesses.length ? score(guesses[r], answer) : null;
            for (var c = 0; c < LEN; c++) {
                var cell = rows[r].children[c];
                cell.textContent = word[c] ? word[c].toUpperCase() : '';
                cell.className = 'q-cell' + (word[c] ? ' filled' : '') + (res ? ' ' + res[c] : '');
            }
        }
        var keys = keyboard.querySelectorAll('.q-key');
        keys.forEach(function (k) {
            var st = keyState[k.dataset.k];
            k.className = 'q-key' + (k.classList.contains('wide') ? ' wide' : '') + (st ? ' ' + st : '');
        });
        // cross off bank words that are already ruled out by grey letters
        bankEl.querySelectorAll('span').forEach(function (s) {
            var w = s.dataset.w, dead = false;
            for (var i = 0; i < w.length; i++) if (keyState[w[i]] === 'miss') { dead = true; break; }
            s.className = dead ? 'dead' : '';
        });
    }

    function say(text) { msg.textContent = text || ''; }

    function submit() {
        if (over) return;
        if (current.length < LEN) { say(t('short')); return; }
        if (BANK.indexOf(current) === -1) { say(t('unknown')); return; }
        var res = score(current, answer);
        res.forEach(function (r, i) {
            var l = current[i], prev = keyState[l];
            if (r === 'hit' || (r === 'near' && prev !== 'hit') || (r === 'miss' && !prev)) keyState[l] = r;
        });
        guesses.push(current);
        var won = current === answer;
        current = '';
        say('');
        if (won || guesses.length === ROWS) finish(won);
        paint();
    }

    function finish(won) {
        over = true;
        say(won ? t('win') + guesses.length + t('tries') : t('lose') + answer.toUpperCase());
        var st = load();
        if (mode === 'daily') {
            if (st.last !== today()) {
                st.last = today(); st.played = (st.played || 0) + 1;
                if (won) { st.won = (st.won || 0) + 1; st.streak = (st.lastWin && st.lastWin === yesterday()) ? (st.streak || 0) + 1 : 1; st.lastWin = today(); st.best = Math.max(st.best || 0, st.streak); }
                else { st.streak = 0; }
            }
            st.todayGuesses = guesses.slice(); st.todayDate = today();
            save(st);
        }
        renderStats();
        var box = document.getElementById('quint-after');
        if (box) { box.hidden = false; }
    }
    function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

    function shareText() {
        var lines = guesses.map(function (g) {
            return score(g, answer).map(function (r) { return r === 'hit' ? '█' : (r === 'near' ? '▒' : '░'); }).join('');
        });
        return 'Quint ' + (mode === 'daily' ? today() : 'random') + ' ' + (guesses[guesses.length - 1] === answer ? guesses.length : 'X') + '/' + ROWS + '\n' + lines.join('\n');
    }

    function renderStats() {
        var st = load();
        statsEl.innerHTML = '';
        [['played', st.played || 0], ['won', st.won || 0], ['streak', st.streak || 0], ['best', st.best || 0]].forEach(function (p) {
            var d = document.createElement('div');
            d.innerHTML = '<b></b><span></span>'; d.firstChild.textContent = p[1]; d.lastChild.textContent = t(p[0]);
            statsEl.appendChild(d);
        });
    }

    function start(m) {
        mode = m;
        answer = m === 'daily' ? dailyWord() : BANK[Math.floor(Math.random() * BANK.length)];
        guesses = []; current = ''; over = false; keyState = {};
        var st = load();
        if (m === 'daily' && st.todayDate === today() && st.todayGuesses) {
            st.todayGuesses.forEach(function (g) {
                guesses.push(g);
                score(g, answer).forEach(function (r, i) {
                    var l = g[i], prev = keyState[l];
                    if (r === 'hit' || (r === 'near' && prev !== 'hit') || (r === 'miss' && !prev)) keyState[l] = r;
                });
            });
            if (guesses[guesses.length - 1] === answer || guesses.length >= ROWS) { over = true; say(guesses[guesses.length - 1] === answer ? t('win') + guesses.length + t('tries') : t('lose') + answer.toUpperCase()); }
        }
        var box = document.getElementById('quint-after'); if (box) box.hidden = !over;
        document.querySelectorAll('[data-quint-mode]').forEach(function (b) { b.classList.toggle('active', b.dataset.quintMode === m); });
        if (!over) say('');
        paint();
    }

    function press(k) {
        if (over) return;
        if (k === 'enter') submit();
        else if (k === 'back') { current = current.slice(0, -1); say(''); paint(); }
        else if (/^[a-z]$/.test(k) && current.length < LEN) { current += k; say(''); paint(); }
    }

    keyboard.addEventListener('click', function (e) { var b = e.target.closest('.q-key'); if (b) press(b.dataset.k); });
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var tg = e.target; if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT')) return;
        var k = e.key;
        if (k === 'Enter') { press('enter'); e.preventDefault(); }
        else if (k === 'Backspace') { press('back'); e.preventDefault(); }
        else if (k.length === 1 && /[a-zA-Z]/.test(k)) press(k.toLowerCase());
    });
    document.querySelectorAll('[data-quint-mode]').forEach(function (b) {
        b.addEventListener('click', function () { start(b.dataset.quintMode); });
    });
    var shareBtn = document.getElementById('quint-share');
    if (shareBtn) shareBtn.addEventListener('click', function () {
        try { navigator.clipboard.writeText(shareText()); say(t('copied')); } catch (e) { say(shareText()); }
    });
    var againBtn = document.getElementById('quint-again');
    if (againBtn) againBtn.addEventListener('click', function () { start('random'); });

    buildBoard(); buildKeys(); buildBank(); renderStats();
    start('daily');
    ['lang-toggle', 'mobile-lang-toggle'].forEach(function (id) {
        var b = document.getElementById(id); if (b) b.addEventListener('click', function () { setTimeout(renderStats, 30); });
    });
    // test hook: lets a headless check play a known word without guessing
    window.__quint = { bank: BANK, get answer() { return answer; } };
})();

/* ==========================================================================
 * Anidle — anime character guessing game (Wordle-style attribute matching)
 *
 * Self-contained: character data + game logic live here, no fetch, no build.
 * The page (games/anidle.html) provides the mount points; the shared chrome
 * is injected by components.js as on every other page.
 *
 * Add a character: push an object to CHARACTERS with the same shape. Add a
 * series: extend SERIES and give characters that `series` value.
 * ======================================================================== */

(function () {
    'use strict';

    /* ---- Series the player can toggle ---- */
    var SERIES = [
        { id: 'frieren', label: 'Frieren' },
        { id: 'naruto',  label: 'Naruto' },
        { id: 'bleach',  label: 'Bleach' },
        { id: 'jjk',     label: 'Jujutsu Kaisen' }
    ];

    /*
     * Character roster. `aliases` powers the typeahead — include first name,
     * last name, and any nickname so typing any of them surfaces the card.
     * `age` is a number (best canonical value); display strings can differ.
     */
    var CHARACTERS = [
        // --- Frieren ---
        { name: 'Frieren', series: 'frieren', gender: 'Female', species: 'Elf',
          hair: 'Silver', role: 'Mage', affiliation: "Hero's Party", age: 1000,
          ageLabel: '1000+', aliases: ['Frieren', 'Frieren the Slayer'] },
        { name: 'Fern', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Purple', role: 'Mage', affiliation: "Hero's Party", age: 16,
          aliases: ['Fern'] },
        { name: 'Stark', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Red', role: 'Warrior', affiliation: "Hero's Party", age: 18,
          aliases: ['Stark'] },
        { name: 'Himmel', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Blue', role: 'Hero', affiliation: "Hero's Party", age: 28,
          aliases: ['Himmel', 'Himmel the Hero'] },

        // --- Naruto ---
        { name: 'Naruto Uzumaki', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Blonde', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Naruto', 'Uzumaki', 'Naruto Uzumaki', 'Seventh Hokage'] },
        { name: 'Sasuke Uchiha', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Sasuke', 'Uchiha', 'Sasuke Uchiha'] },
        { name: 'Sakura Haruno', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Pink', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Sakura', 'Haruno', 'Sakura Haruno'] },
        { name: 'Kakashi Hatake', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Silver', role: 'Ninja', affiliation: 'Hidden Leaf', age: 31,
          aliases: ['Kakashi', 'Hatake', 'Copy Ninja', 'Sixth Hokage'] },

        // --- Bleach ---
        { name: 'Ichigo Kurosaki', series: 'bleach', gender: 'Male', species: 'Human',
          hair: 'Orange', role: 'Shinigami', affiliation: 'Soul Society', age: 15,
          aliases: ['Ichigo', 'Kurosaki', 'Ichigo Kurosaki'] },
        { name: 'Rukia Kuchiki', series: 'bleach', gender: 'Female', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 150,
          aliases: ['Rukia', 'Kuchiki', 'Rukia Kuchiki'] },

        // --- Jujutsu Kaisen ---
        { name: 'Yuji Itadori', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Pink', role: 'Sorcerer', affiliation: 'Jujutsu High', age: 15,
          aliases: ['Yuji', 'Itadori', 'Yuji Itadori'] },
        { name: 'Satoru Gojo', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'White', role: 'Sorcerer', affiliation: 'Jujutsu High', age: 28,
          aliases: ['Gojo', 'Satoru', 'Satoru Gojo', 'Gojo Satoru'] },
        { name: 'Megumi Fushiguro', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Jujutsu High', age: 15,
          aliases: ['Megumi', 'Fushiguro', 'Megumi Fushiguro'] },
        { name: 'Nobara Kugisaki', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Orange', role: 'Sorcerer', affiliation: 'Jujutsu High', age: 16,
          aliases: ['Nobara', 'Kugisaki', 'Nobara Kugisaki'] }
    ];

    /* Columns rendered in each guess row, left to right. */
    var COLUMNS = [
        { key: 'series',      label: 'Series' },
        { key: 'gender',      label: 'Gender' },
        { key: 'species',     label: 'Species' },
        { key: 'hair',        label: 'Hair' },
        { key: 'role',        label: 'Class' },
        { key: 'affiliation', label: 'Affiliation' },
        { key: 'age',         label: 'Age' }
    ];

    var seriesLabel = {};
    SERIES.forEach(function (s) { seriesLabel[s.id] = s.label; });

    /* ---- Game state ---- */
    var state = {
        active: SERIES.map(function (s) { return s.id; }), // selected series ids
        pool: [],          // characters in play
        target: null,      // the character to guess
        guessed: [],       // names already guessed
        over: false
    };

    /* ---- DOM refs (filled on init) ---- */
    var el = {};

    function poolFromSelection() {
        return CHARACTERS.filter(function (c) {
            return state.active.indexOf(c.series) !== -1;
        });
    }

    function newGame() {
        state.pool = poolFromSelection();
        state.guessed = [];
        state.over = false;
        if (state.pool.length === 0) {
            state.target = null;
            el.board.innerHTML = '';
            el.message.textContent = 'Pick at least one series, then start a new game.';
            el.message.className = 'anidle-message is-warn';
            setInputEnabled(false);
            return;
        }
        state.target = state.pool[Math.floor(Math.random() * state.pool.length)];
        el.board.innerHTML = '';
        el.message.textContent = state.pool.length + ' characters in the pool. Start guessing.';
        el.message.className = 'anidle-message';
        el.input.value = '';
        closeSuggestions();
        setInputEnabled(true);
        el.input.focus();
    }

    function setInputEnabled(on) {
        el.input.disabled = !on;
        el.guessBtn.disabled = !on;
    }

    /* ---- Comparison: returns feedback state per column ---- */
    function compare(guess) {
        var t = state.target;
        return COLUMNS.map(function (col) {
            var k = col.key;
            if (k === 'age') {
                var g = guess.age, a = t.age;
                var statusA = g === a ? 'hit' : (Math.abs(g - a) <= 5 ? 'near' : 'miss');
                var arrow = g === a ? '' : (a > g ? ' ↑' : ' ↓');
                return { key: k, text: (guess.ageLabel || String(g)) + arrow, status: statusA };
            }
            var gv = guess[k], tv = t[k];
            var display = k === 'series' ? seriesLabel[gv] : gv;
            return { key: k, text: display, status: gv === tv ? 'hit' : 'miss' };
        });
    }

    function renderRow(guess) {
        var cells = compare(guess);
        var row = document.createElement('div');
        row.className = 'anidle-row';

        var nameCell = document.createElement('div');
        nameCell.className = 'anidle-cell anidle-name';
        nameCell.textContent = guess.name;
        row.appendChild(nameCell);

        cells.forEach(function (c) {
            var cell = document.createElement('div');
            cell.className = 'anidle-cell is-' + c.status;
            cell.textContent = c.text;
            row.appendChild(cell);
        });

        // Prepend so newest guess is on top.
        el.board.insertBefore(row, el.board.firstChild);
        // micro reveal
        requestAnimationFrame(function () { row.classList.add('revealed'); });
    }

    function submitGuess(character) {
        if (state.over || !character) return;
        if (state.guessed.indexOf(character.name) !== -1) {
            flashMessage('Already guessed ' + character.name + '.', 'is-warn');
            return;
        }
        state.guessed.push(character.name);
        renderRow(character);
        el.input.value = '';
        closeSuggestions();

        if (character.name === state.target.name) {
            state.over = true;
            setInputEnabled(false);
            el.message.textContent = 'Solved it in ' + state.guessed.length +
                (state.guessed.length === 1 ? ' guess' : ' guesses') + ' — ' + state.target.name + '.';
            el.message.className = 'anidle-message is-win';
        } else {
            el.message.textContent = state.guessed.length + ' ' +
                (state.guessed.length === 1 ? 'guess' : 'guesses') + ' — keep going.';
            el.message.className = 'anidle-message';
            el.input.focus();
        }
    }

    var flashTimer = null;
    function flashMessage(text, cls) {
        var prev = el.message.textContent, prevCls = el.message.className;
        el.message.textContent = text;
        el.message.className = 'anidle-message ' + cls;
        clearTimeout(flashTimer);
        flashTimer = setTimeout(function () {
            if (state.over) return;
            el.message.textContent = prev;
            el.message.className = prevCls;
        }, 1600);
    }

    /* ---- Typeahead ---- */
    var activeIndex = -1;
    var currentMatches = [];

    function findMatches(q) {
        q = q.trim().toLowerCase();
        if (!q) return [];
        var seen = {};
        return state.pool.filter(function (c) {
            if (state.guessed.indexOf(c.name) !== -1) return false;
            var hit = c.aliases.some(function (a) {
                return a.toLowerCase().indexOf(q) !== -1;
            });
            if (hit && !seen[c.name]) { seen[c.name] = true; return true; }
            return false;
        }).slice(0, 8);
    }

    function renderSuggestions() {
        if (currentMatches.length === 0) { closeSuggestions(); return; }
        el.suggest.innerHTML = '';
        currentMatches.forEach(function (c, i) {
            var item = document.createElement('button');
            item.type = 'button';
            item.className = 'anidle-suggest-item' + (i === activeIndex ? ' active' : '');
            item.setAttribute('role', 'option');
            item.innerHTML = '<span class="s-name">' + c.name + '</span>' +
                '<span class="s-series">' + seriesLabel[c.series] + '</span>';
            item.addEventListener('mousedown', function (e) {
                e.preventDefault();
                submitGuess(c);
            });
            el.suggest.appendChild(item);
        });
        el.suggest.hidden = false;
    }

    function closeSuggestions() {
        el.suggest.hidden = true;
        el.suggest.innerHTML = '';
        currentMatches = [];
        activeIndex = -1;
    }

    function onInput() {
        currentMatches = findMatches(el.input.value);
        activeIndex = currentMatches.length ? 0 : -1;
        renderSuggestions();
    }

    function onKeyDown(e) {
        if (el.suggest.hidden && e.key !== 'Enter') return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, currentMatches.length - 1);
            renderSuggestions();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
            renderSuggestions();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && currentMatches[activeIndex]) {
                submitGuess(currentMatches[activeIndex]);
            } else if (currentMatches.length === 1) {
                submitGuess(currentMatches[0]);
            }
        } else if (e.key === 'Escape') {
            closeSuggestions();
        }
    }

    /* ---- Series toggle UI ---- */
    function buildSeriesToggles() {
        el.series.innerHTML = '';
        SERIES.forEach(function (s) {
            var label = document.createElement('label');
            label.className = 'anidle-series-chip active';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.value = s.id;
            cb.addEventListener('change', function () {
                if (cb.checked) {
                    if (state.active.indexOf(s.id) === -1) state.active.push(s.id);
                    label.classList.add('active');
                } else {
                    state.active = state.active.filter(function (x) { return x !== s.id; });
                    label.classList.remove('active');
                }
            });
            var span = document.createElement('span');
            span.textContent = s.label;
            label.appendChild(cb);
            label.appendChild(span);
            el.series.appendChild(label);
        });
    }

    /* ---- Header row (column labels) ---- */
    function buildHeader() {
        el.header.innerHTML = '';
        var nameHead = document.createElement('div');
        nameHead.className = 'anidle-cell anidle-head anidle-name';
        nameHead.textContent = 'Character';
        el.header.appendChild(nameHead);
        COLUMNS.forEach(function (col) {
            var c = document.createElement('div');
            c.className = 'anidle-cell anidle-head';
            c.textContent = col.label;
            el.header.appendChild(c);
        });
    }

    function init() {
        el.series  = document.getElementById('anidle-series');
        el.input   = document.getElementById('anidle-input');
        el.suggest = document.getElementById('anidle-suggest');
        el.guessBtn = document.getElementById('anidle-guess');
        el.newBtn  = document.getElementById('anidle-new');
        el.header  = document.getElementById('anidle-header');
        el.board   = document.getElementById('anidle-board');
        el.message = document.getElementById('anidle-message');
        if (!el.input) return; // not on this page

        buildSeriesToggles();
        buildHeader();

        el.input.addEventListener('input', onInput);
        el.input.addEventListener('keydown', onKeyDown);
        el.input.addEventListener('blur', function () {
            setTimeout(closeSuggestions, 120);
        });
        el.guessBtn.addEventListener('click', function () {
            if (currentMatches.length) submitGuess(currentMatches[activeIndex >= 0 ? activeIndex : 0]);
            else el.input.focus();
        });
        el.newBtn.addEventListener('click', newGame);

        newGame();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

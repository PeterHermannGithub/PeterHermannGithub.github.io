/*
 * language.js — "Which language?", ten snippets, four choices each.
 * Every snippet carries a "tell": the one token that gives the language away.
 */
(function () {
    'use strict';
    var root = document.getElementById('lg-root');
    if (!root) return;

    var SNIPPETS = [
        ['Rust', 'let mut v: Vec<i32> = Vec::new();\nv.push(1);\nfor x in &v {\n    println!("{}", x);\n}', 'let mut and println! with a bang: only Rust marks mutation and macros this loudly.', 'A let mut és a felkiáltójeles println! árulkodó: a Rust ennyire hangosan jelöli a változtathatóságot és a makrókat.'],
        ['Rust', 'match s.len() {\n    0 => println!("empty"),\n    n => println!("{n} bytes"),\n}', 'A match with => arms and an expression-position binding.', 'match => ágakkal és kifejezésben kötött névvel.'],
        ['Rust', 'let total: u64 = items.iter().map(|i| i.price).sum();', 'The |i| closure syntax and the typed let.', 'A |i| lambda-szintaxis és a típusos let.'],
        ['Go', 'ch := make(chan int)\ngo func() { ch <- 42 }()\nfmt.Println(<-ch)', 'go func and the <- channel arrows.', 'A go func és a <- csatornanyilak.'],
        ['Go', 'if err != nil {\n\treturn nil, fmt.Errorf("load: %w", err)\n}', 'if err != nil is practically a signature.', 'Az if err != nil gyakorlatilag aláírás.'],
        ['Go', 'for i, v := range items {\n\tfmt.Println(i, v)\n}', ':= with range, and no parentheses around the header.', ':= a range mellett, és nincs zárójel a fejlécben.'],
        ['Kotlin', 'data class User(val name: String, val age: Int)', 'data class with val in the constructor.', 'data class val-lal a konstruktorban.'],
        ['Kotlin', 'val names = users.filter { it.age > 18 }.map { it.name }', 'The implicit it inside braces.', 'Az implicit it a kapcsos zárójelben.'],
        ['Kotlin', 'fun greet(name: String?) =\n    println("Hello, ${name ?: "stranger"}")', 'fun, the nullable String?, and the ?: Elvis operator.', 'fun, a nullable String? és a ?: Elvis-operátor.'],
        ['Python', 'squares = [x * x for x in range(10) if x % 2 == 0]', 'A list comprehension with a trailing if.', 'Listaértelmezés záró if-fel.'],
        ['Python', 'with open(path) as f:\n    data = json.load(f)', 'with ... as, and the indentation doing the braces\' job.', 'with ... as, és a behúzás végzi a kapcsos zárójelek dolgát.'],
        ['Python', 'class Dog(Animal):\n    def speak(self):\n        return "woof"', 'class X(Base): and def speak(self).', 'class X(Base): és def speak(self).'],
        ['SQL', 'SELECT name, COUNT(*)\nFROM orders\nGROUP BY name\nHAVING COUNT(*) > 3;', 'HAVING only exists for filtering groups.', 'A HAVING csak csoportok szűrésére van.'],
        ['SQL', "UPDATE users\nSET active = false\nWHERE last_login < NOW() - INTERVAL '90 days';", 'UPDATE ... SET ... WHERE, and an INTERVAL literal.', 'UPDATE ... SET ... WHERE, és egy INTERVAL literál.'],
        ['SQL', 'WITH recent AS (\n  SELECT * FROM events\n  WHERE ts > now() - interval \'1 day\'\n)\nSELECT count(*) FROM recent;', 'A WITH common table expression.', 'WITH közös táblakifejezés.'],
        ['JavaScript', 'const total = items.reduce((sum, i) => sum + i.price, 0);', 'const with an arrow function: (a, b) => ...', 'const nyílfüggvénnyel: (a, b) => ...'],
        ['JavaScript', "document.querySelectorAll('.card')\n  .forEach(el => el.classList.add('on'));", 'document.querySelectorAll is the browser giving it away.', 'A document.querySelectorAll a böngészőt árulja el.'],
        ['JavaScript', 'async function load(url) {\n  const res = await fetch(url);\n  return res.json();\n}', 'async/await around fetch.', 'async/await a fetch körül.'],
        ['C++', 'std::vector<int> v{1, 2, 3};\nfor (auto& x : v) std::cout << x << \'\\n\';', 'std:: everywhere, and << to a stream.', 'Mindenhol std::, és << egy adatfolyamba.'],
        ['C++', 'template <typename T>\nT max(T a, T b) { return a > b ? a : b; }', 'template <typename T>.', 'template <typename T>.'],
        ['R', 'df %>% filter(age > 30) %>% summarise(mean(income))', 'The %>% pipe.', 'A %>% csővezeték.'],
        ['R', 'model <- lm(y ~ x1 + x2, data = train)', 'The <- assignment and the ~ formula.', 'A <- értékadás és a ~ formula.']
    ];
    var LANGS = ['Rust', 'Go', 'Kotlin', 'Python', 'SQL', 'JavaScript', 'C++', 'R'];
    var ROUNDS = 10;
    var STR = {
        en: { round: 'Round', of: 'of', prompt: 'Which language is this?', next: 'Next snippet', finish: 'See result', again: 'Play again', done: 'Final score', correct: 'Correct. ', wrong: 'It was ', best: 'Best', tell: 'The tell: ', hi: 'You read punctuation fluently.', mid: 'Solid. The ambiguous ones are the fun ones.', lo: 'Punctuation is a language of its own. Go again.' },
        hu: { round: 'Kör', of: '/', prompt: 'Melyik nyelv ez?', next: 'Következő részlet', finish: 'Eredmény', again: 'Újra', done: 'Végeredmény', correct: 'Helyes. ', wrong: 'Ez volt: ', best: 'Legjobb', tell: 'Az árulkodó jel: ', hi: 'Folyékonyan olvasod az írásjeleket.', mid: 'Jó. Az félreérthetők a legjobbak.', lo: 'Az írásjelek külön nyelv. Próbáld újra.' }
    };
    function lang() { return document.documentElement.lang === 'hu' ? 'hu' : 'en'; }
    function t(k) { return STR[lang()][k]; }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
    function best() { try { return +localStorage.getItem('lg-best') || 0; } catch (e) { return 0; } }
    function setBest(n) { try { localStorage.setItem('lg-best', String(n)); } catch (e) {} }

    var state;
    function start() { state = { n: 0, score: 0, deck: shuffle(SNIPPETS).slice(0, ROUNDS), picked: null, done: false }; draw(); }
    function options(snip) {
        var others = shuffle(LANGS.filter(function (l) { return l !== snip[0]; })).slice(0, 3);
        return shuffle(others.concat(snip[0]));
    }

    function draw() {
        root.innerHTML = '';
        if (state.done) return end();
        var snip = state.deck[state.n];
        if (!state.opts) state.opts = options(snip);
        var head = el('div', 'nb-head');
        head.appendChild(el('span', 'ex-label', t('round') + ' ' + (state.n + 1) + ' ' + t('of') + ' ' + ROUNDS));
        head.appendChild(el('span', 'ex-label', state.score + ' / ' + state.n));
        root.appendChild(head);
        root.appendChild(el('p', 'nb-prompt', t('prompt')));
        var pre = el('pre', 'lg-code'); pre.appendChild(el('code', null, snip[1]));
        root.appendChild(pre);
        var opts = el('div', 'lg-opts');
        state.opts.forEach(function (name) {
            var b = el('button', 'nb-opt lg-opt', name); b.type = 'button';
            if (state.picked) {
                b.disabled = true;
                if (name === snip[0]) b.classList.add('is-top');
                else if (name === state.picked) b.classList.add('is-wrong');
            } else {
                b.addEventListener('click', function () { state.picked = name; if (name === snip[0]) state.score++; draw(); });
            }
            opts.appendChild(b);
        });
        root.appendChild(opts);
        if (state.picked) {
            var ok = state.picked === snip[0];
            root.appendChild(el('p', 'nb-verdict ' + (ok ? 'ok' : 'no'), (ok ? t('correct') : t('wrong') + snip[0] + '. ') + t('tell') + (lang() === 'hu' ? snip[3] : snip[2])));
            var nx = el('button', 'btn btn-primary', state.n + 1 === ROUNDS ? t('finish') : t('next')); nx.type = 'button';
            nx.addEventListener('click', function () {
                state.n++; state.picked = null; state.opts = null;
                if (state.n === ROUNDS) { state.done = true; if (state.score > best()) setBest(state.score); }
                draw();
            });
            root.appendChild(nx); nx.focus();
        }
    }

    function end() {
        root.appendChild(el('p', 'ex-label', t('done')));
        root.appendChild(el('div', 'nb-final', state.score + ' / ' + ROUNDS));
        root.appendChild(el('p', 'nb-verdict', t(state.score >= 8 ? 'hi' : (state.score >= 5 ? 'mid' : 'lo'))));
        root.appendChild(el('p', 'ex-label', t('best') + ': ' + best() + ' / ' + ROUNDS));
        var b = el('button', 'btn btn-primary', t('again')); b.type = 'button'; b.addEventListener('click', start);
        root.appendChild(b);
    }

    start();
    ['lang-toggle', 'mobile-lang-toggle'].forEach(function (id) {
        var b = document.getElementById(id); if (b) b.addEventListener('click', function () { setTimeout(draw, 30); });
    });
})();

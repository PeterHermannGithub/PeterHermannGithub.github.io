/*
 * anime-data.js — the 40 hand-tagged titles behind the explorer and the Neighbours game,
 * plus the V2 similarity arithmetic (tag 60 / score 20 / year 15 / type 5).
 * Scores are rounded and illustrative, not a data source.
 */
(function () {
    'use strict';
    // [title, year, score, type, tags]
    var RAW = [
        ['Fullmetal Alchemist: Brotherhood', 2009, 9.1, 'tv', 'action adventure fantasy drama military magic shounen'],
        ['Steins;Gate', 2011, 9.1, 'tv', 'sci-fi thriller drama time-travel psychological'],
        ['Attack on Titan', 2013, 8.5, 'tv', 'action drama military post-apocalyptic mystery shounen'],
        ['Death Note', 2006, 8.6, 'tv', 'mystery thriller psychological supernatural shounen'],
        ['Cowboy Bebop', 1998, 8.7, 'tv', 'action sci-fi adventure drama seinen'],
        ['Frieren', 2023, 9.3, 'tv', 'adventure fantasy drama magic slice-of-life'],
        ['Naruto', 2002, 8.0, 'tv', 'action adventure martial-arts shounen coming-of-age'],
        ['Bleach', 2004, 7.9, 'tv', 'action supernatural martial-arts shounen'],
        ['Jujutsu Kaisen', 2020, 8.6, 'tv', 'action supernatural school shounen'],
        ['One Piece', 1999, 8.7, 'tv', 'action adventure comedy fantasy shounen'],
        ['Hunter x Hunter', 2011, 9.0, 'tv', 'action adventure fantasy shounen martial-arts'],
        ['Demon Slayer', 2019, 8.4, 'tv', 'action supernatural historical shounen martial-arts'],
        ['My Hero Academia', 2016, 7.9, 'tv', 'action school shounen coming-of-age'],
        ['Spy x Family', 2022, 8.6, 'tv', 'comedy action slice-of-life shounen'],
        ['Vinland Saga', 2019, 8.7, 'tv', 'action drama historical adventure seinen'],
        ['Mob Psycho 100', 2016, 8.5, 'tv', 'action comedy supernatural school coming-of-age'],
        ['One Punch Man', 2015, 8.5, 'tv', 'action comedy supernatural seinen'],
        ['Code Geass', 2006, 8.7, 'tv', 'mecha military psychological sci-fi thriller school'],
        ['Neon Genesis Evangelion', 1995, 8.3, 'tv', 'mecha psychological sci-fi drama post-apocalyptic'],
        ['Your Name', 2016, 8.8, 'movie', 'romance drama supernatural school coming-of-age'],
        ['Spirited Away', 2001, 8.8, 'movie', 'adventure fantasy supernatural coming-of-age'],
        ['Violet Evergarden', 2018, 8.5, 'tv', 'drama fantasy slice-of-life military'],
        ['Clannad: After Story', 2008, 8.9, 'tv', 'drama romance slice-of-life school supernatural'],
        ['Toradora!', 2008, 8.1, 'tv', 'romance comedy school slice-of-life drama'],
        ['Made in Abyss', 2017, 8.7, 'tv', 'adventure fantasy mystery drama thriller'],
        ['Monster', 2004, 8.9, 'tv', 'mystery thriller psychological drama seinen'],
        ['Psycho-Pass', 2012, 8.3, 'tv', 'sci-fi thriller psychological action seinen'],
        ['Ghost in the Shell', 1995, 8.3, 'movie', 'sci-fi action psychological seinen military'],
        ['Akira', 1988, 8.0, 'movie', 'sci-fi action post-apocalyptic psychological seinen'],
        ['Haikyuu!!', 2014, 8.5, 'tv', 'sports school comedy drama shounen coming-of-age'],
        ['Kaguya-sama: Love Is War', 2019, 8.4, 'tv', 'romance comedy school psychological seinen'],
        ['Bocchi the Rock!', 2022, 8.8, 'tv', 'music comedy slice-of-life school coming-of-age'],
        ['Chainsaw Man', 2022, 8.5, 'tv', 'action supernatural thriller shounen'],
        ['Dr. Stone', 2019, 8.3, 'tv', 'sci-fi adventure comedy shounen post-apocalyptic'],
        ['Mushishi', 2005, 8.7, 'tv', 'supernatural mystery slice-of-life historical fantasy'],
        ['Samurai Champloo', 2004, 8.5, 'tv', 'action adventure comedy historical martial-arts'],
        ['Trigun', 1998, 8.2, 'tv', 'action sci-fi adventure comedy shounen'],
        ['Ping Pong the Animation', 2014, 8.7, 'tv', 'sports drama psychological seinen coming-of-age'],
        ['Oshi no Ko', 2023, 8.7, 'tv', 'drama supernatural mystery music seinen'],
        ['Cyberpunk: Edgerunners', 2022, 8.6, 'tv', 'action sci-fi drama psychological']
    ];
    var DATA = RAW.map(function (r, i) {
        return { i: i, title: r[0], year: r[1], score: r[2], type: r[3], tags: r[4].split(' ') };
    });


    var PARTS = ['tag', 'score', 'year', 'type'];
    var W_DEFAULT = { tag: 60, score: 20, year: 15, type: 5 };

    function parts(a, b) {
        var A = a.tags, B = b.tags, inter = 0, k;
        for (k = 0; k < A.length; k++) if (B.indexOf(A[k]) !== -1) inter++;
        var union = A.length + B.length - inter;
        return {
            tag: union ? inter / union : 0,
            score: Math.max(0, 1 - Math.abs(a.score - b.score) / 3),
            year: 1 - Math.min(Math.abs(a.year - b.year), 25) / 25,
            type: a.type === b.type ? 1 : 0,
            shared: A.filter(function (x) { return B.indexOf(x) !== -1; })
        };
    }
    function sim(a, b, w) {
        w = w || W_DEFAULT;
        var total = PARTS.reduce(function (s, p) { return s + w[p]; }, 0) || 1;
        var p = parts(a, b), c = {}, sum = 0;
        PARTS.forEach(function (k) { c[k] = (w[k] / total) * p[k]; sum += c[k]; });
        return { sum: sum, c: c, shared: p.shared };
    }
    window.ANIME = { DATA: DATA, PARTS: PARTS, W_DEFAULT: W_DEFAULT, parts: parts, sim: sim };
})();

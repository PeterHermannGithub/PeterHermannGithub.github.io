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
        // ============ Frieren: Beyond Journey's End ============
        { name: 'Frieren', series: 'frieren', gender: 'Female', species: 'Elf',
          hair: 'Silver', role: 'Mage', affiliation: "Hero's Party", age: 1000,
          ageLabel: '1000+', aliases: ['Frieren', 'Frieren the Slayer'] },
        { name: 'Fern', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Purple', role: 'Mage', affiliation: "Hero's Party", age: 18,
          aliases: ['Fern'] },
        { name: 'Stark', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Red', role: 'Warrior', affiliation: "Hero's Party", age: 18,
          aliases: ['Stark'] },
        { name: 'Himmel', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Blue', role: 'Hero', affiliation: "Hero's Party", age: 28,
          aliases: ['Himmel', 'Himmel the Hero'] },
        { name: 'Heiter', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Gray', role: 'Priest', affiliation: "Hero's Party", age: 70,
          aliases: ['Heiter'] },
        { name: 'Eisen', series: 'frieren', gender: 'Male', species: 'Dwarf',
          hair: 'Black', role: 'Warrior', affiliation: "Hero's Party", age: 130,
          aliases: ['Eisen'] },
        { name: 'Sein', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Green', role: 'Priest', affiliation: "Hero's Party", age: 30,
          aliases: ['Sein'] },
        { name: 'Serie', series: 'frieren', gender: 'Female', species: 'Elf',
          hair: 'Pink', role: 'Mage', affiliation: 'Magic Association', age: 1500,
          ageLabel: '1500+', aliases: ['Serie', 'Great Mage Serie'] },
        { name: 'Aura', series: 'frieren', gender: 'Female', species: 'Demon',
          hair: 'Blonde', role: 'Mage', affiliation: 'Seven Sages', age: 500,
          ageLabel: '500+', aliases: ['Aura', 'Aura the Guillotine'] },
        { name: 'Übel', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Mage', affiliation: 'Magic Association', age: 20,
          aliases: ['Übel', 'Ubel'] },
        { name: 'Denken', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Gray', role: 'Mage', affiliation: 'Magic Association', age: 70,
          aliases: ['Denken'] },
        { name: 'Wirbel', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Gray', role: 'Mage', affiliation: 'Magic Association', age: 25,
          aliases: ['Wirbel'] },
        { name: 'Lawine', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Mage', affiliation: 'Magic Association', age: 18,
          aliases: ['Lawine'] },
        { name: 'Kanne', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Brown', role: 'Mage', affiliation: 'Magic Association', age: 18,
          aliases: ['Kanne'] },
        { name: 'Land', series: 'frieren', gender: 'Male', species: 'Human',
          hair: 'Blonde', role: 'Mage', affiliation: 'Magic Association', age: 25,
          aliases: ['Land'] },
        { name: 'Methode', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Mage', affiliation: 'Magic Association', age: 30,
          aliases: ['Methode'] },
        { name: 'Sense', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Mage', affiliation: 'Magic Association', age: 40,
          aliases: ['Sense'] },
        { name: 'Laufen', series: 'frieren', gender: 'Female', species: 'Human',
          hair: 'Green', role: 'Mage', affiliation: 'Magic Association', age: 22,
          aliases: ['Laufen'] },
        { name: 'Lügner', series: 'frieren', gender: 'Male', species: 'Demon',
          hair: 'White', role: 'Mage', affiliation: 'Demons', age: 80,
          aliases: ['Lügner', 'Lugner'] },
        { name: 'Macht', series: 'frieren', gender: 'Male', species: 'Demon',
          hair: 'Blonde', role: 'Mage', affiliation: 'Demons', age: 200,
          ageLabel: '200+', aliases: ['Macht'] },

        // ============ Naruto ============
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
        { name: 'Hinata Hyuga', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 16,
          aliases: ['Hinata', 'Hyuga', 'Hyuuga', 'Hinata Hyuga'] },
        { name: 'Gaara', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Red', role: 'Ninja', affiliation: 'Hidden Sand', age: 17,
          aliases: ['Gaara', 'Kazekage'] },
        { name: 'Rock Lee', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Rock Lee', 'Lee'] },
        { name: 'Shikamaru Nara', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Shikamaru', 'Nara', 'Shikamaru Nara'] },
        { name: 'Ino Yamanaka', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Blonde', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Ino', 'Yamanaka', 'Ino Yamanaka'] },
        { name: 'Choji Akimichi', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Choji', 'Akimichi', 'Choji Akimichi'] },
        { name: 'Neji Hyuga', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 18,
          aliases: ['Neji', 'Neji Hyuga', 'Hyuga'] },
        { name: 'Might Guy', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 31,
          aliases: ['Might Guy', 'Guy', 'Gai', 'Might Gai'] },
        { name: 'Itachi Uchiha', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Akatsuki', age: 21,
          aliases: ['Itachi', 'Uchiha', 'Itachi Uchiha'] },
        { name: 'Deidara', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Blonde', role: 'Ninja', affiliation: 'Akatsuki', age: 19,
          aliases: ['Deidara'] },
        { name: 'Kisame Hoshigaki', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Blue', role: 'Ninja', affiliation: 'Akatsuki', age: 32,
          aliases: ['Kisame', 'Hoshigaki', 'Kisame Hoshigaki'] },
        { name: 'Obito Uchiha', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Akatsuki', age: 31,
          aliases: ['Obito', 'Tobi', 'Obito Uchiha'] },
        { name: 'Jiraiya', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'White', role: 'Ninja', affiliation: 'Hidden Leaf', age: 54,
          aliases: ['Jiraiya', 'Toad Sage', 'Pervy Sage'] },
        { name: 'Tsunade', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Blonde', role: 'Ninja', affiliation: 'Hidden Leaf', age: 54,
          aliases: ['Tsunade', 'Fifth Hokage'] },
        { name: 'Orochimaru', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Sound', age: 54,
          aliases: ['Orochimaru'] },
        { name: 'Sai', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Sai'] },
        { name: 'Shino Aburame', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Shino', 'Aburame', 'Shino Aburame'] },
        { name: 'Kiba Inuzuka', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Kiba', 'Inuzuka', 'Kiba Inuzuka'] },
        { name: 'Tenten', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 17,
          aliases: ['Tenten'] },
        { name: 'Temari', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Blonde', role: 'Ninja', affiliation: 'Hidden Sand', age: 19,
          aliases: ['Temari'] },
        { name: 'Kankuro', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Sand', age: 18,
          aliases: ['Kankuro'] },
        { name: 'Minato Namikaze', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Blonde', role: 'Ninja', affiliation: 'Hidden Leaf', age: 24,
          aliases: ['Minato', 'Namikaze', 'Fourth Hokage', 'Yellow Flash'] },
        { name: 'Konohamaru', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 13,
          aliases: ['Konohamaru', 'Sarutobi'] },
        { name: 'Killer Bee', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'White', role: 'Ninja', affiliation: 'Hidden Cloud', age: 36,
          aliases: ['Killer Bee', 'Bee', 'Killer B'] },
        { name: 'Yamato', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 27,
          aliases: ['Yamato', 'Tenzo'] },
        { name: 'Iruka Umino', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Hidden Leaf', age: 29,
          aliases: ['Iruka', 'Umino', 'Iruka Umino'] },
        { name: 'Shizune', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Ninja', affiliation: 'Hidden Leaf', age: 30,
          aliases: ['Shizune'] },
        { name: 'Konan', series: 'naruto', gender: 'Female', species: 'Human',
          hair: 'Blue', role: 'Ninja', affiliation: 'Akatsuki', age: 35,
          aliases: ['Konan'] },
        { name: 'Nagato', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Red', role: 'Ninja', affiliation: 'Akatsuki', age: 35,
          aliases: ['Nagato', 'Pain', 'Pein'] },
        { name: 'Sasori', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Red', role: 'Ninja', affiliation: 'Akatsuki', age: 35,
          aliases: ['Sasori'] },
        { name: 'Hidan', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Gray', role: 'Ninja', affiliation: 'Akatsuki', age: 22,
          aliases: ['Hidan'] },
        { name: 'Kakuzu', series: 'naruto', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Ninja', affiliation: 'Akatsuki', age: 91,
          aliases: ['Kakuzu'] },

        // ============ Bleach ============
        { name: 'Ichigo Kurosaki', series: 'bleach', gender: 'Male', species: 'Human',
          hair: 'Orange', role: 'Shinigami', affiliation: 'Karakura Town', age: 15,
          aliases: ['Ichigo', 'Kurosaki', 'Ichigo Kurosaki'] },
        { name: 'Rukia Kuchiki', series: 'bleach', gender: 'Female', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 150,
          ageLabel: '150+', aliases: ['Rukia', 'Kuchiki', 'Rukia Kuchiki'] },
        { name: 'Renji Abarai', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Red', role: 'Shinigami', affiliation: 'Soul Society', age: 160,
          ageLabel: '160+', aliases: ['Renji', 'Abarai', 'Renji Abarai'] },
        { name: 'Byakuya Kuchiki', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 240,
          ageLabel: '240+', aliases: ['Byakuya', 'Kuchiki', 'Byakuya Kuchiki'] },
        { name: 'Toshiro Hitsugaya', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'White', role: 'Shinigami', affiliation: 'Soul Society', age: 130,
          ageLabel: '130+', aliases: ['Toshiro', 'Hitsugaya', 'Toshiro Hitsugaya'] },
        { name: 'Kenpachi Zaraki', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 200,
          ageLabel: '200+', aliases: ['Kenpachi', 'Zaraki', 'Kenpachi Zaraki'] },
        { name: 'Rangiku Matsumoto', series: 'bleach', gender: 'Female', species: 'Shinigami',
          hair: 'Orange', role: 'Shinigami', affiliation: 'Soul Society', age: 100,
          ageLabel: '100+', aliases: ['Rangiku', 'Matsumoto', 'Rangiku Matsumoto'] },
        { name: 'Yoruichi Shihoin', series: 'bleach', gender: 'Female', species: 'Shinigami',
          hair: 'Purple', role: 'Shinigami', affiliation: 'Soul Society', age: 150,
          ageLabel: '150+', aliases: ['Yoruichi', 'Shihoin', 'Yoruichi Shihoin'] },
        { name: 'Kisuke Urahara', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Blonde', role: 'Shinigami', affiliation: 'Karakura Town', age: 200,
          ageLabel: '200+', aliases: ['Urahara', 'Kisuke', 'Kisuke Urahara'] },
        { name: 'Sosuke Aizen', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Brown', role: 'Shinigami', affiliation: 'Hueco Mundo', age: 200,
          ageLabel: '200+', aliases: ['Aizen', 'Sosuke', 'Sosuke Aizen'] },
        { name: 'Gin Ichimaru', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Silver', role: 'Shinigami', affiliation: 'Hueco Mundo', age: 100,
          ageLabel: '100+', aliases: ['Gin', 'Ichimaru', 'Gin Ichimaru'] },
        { name: 'Orihime Inoue', series: 'bleach', gender: 'Female', species: 'Human',
          hair: 'Orange', role: 'Human', affiliation: 'Karakura Town', age: 15,
          aliases: ['Orihime', 'Inoue', 'Orihime Inoue'] },
        { name: 'Uryu Ishida', series: 'bleach', gender: 'Male', species: 'Quincy',
          hair: 'Black', role: 'Quincy', affiliation: 'Karakura Town', age: 15,
          aliases: ['Uryu', 'Ishida', 'Uryu Ishida'] },
        { name: 'Yasutora Sado', series: 'bleach', gender: 'Male', species: 'Human',
          hair: 'Brown', role: 'Human', affiliation: 'Karakura Town', age: 15,
          aliases: ['Chad', 'Sado', 'Yasutora', 'Yasutora Sado'] },
        { name: 'Grimmjow Jaegerjaquez', series: 'bleach', gender: 'Male', species: 'Arrancar',
          hair: 'Blue', role: 'Arrancar', affiliation: 'Hueco Mundo', age: 21,
          aliases: ['Grimmjow', 'Jaegerjaquez'] },
        { name: 'Ulquiorra Cifer', series: 'bleach', gender: 'Male', species: 'Arrancar',
          hair: 'Black', role: 'Arrancar', affiliation: 'Hueco Mundo', age: 22,
          aliases: ['Ulquiorra', 'Cifer', 'Ulquiorra Cifer'] },
        { name: 'Nelliel Tu Odelschwanck', series: 'bleach', gender: 'Female', species: 'Arrancar',
          hair: 'Green', role: 'Arrancar', affiliation: 'Hueco Mundo', age: 22,
          aliases: ['Nel', 'Nelliel', 'Odelschwanck'] },
        { name: 'Suì-Fēng', series: 'bleach', gender: 'Female', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 250,
          ageLabel: '250+', aliases: ['Soi Fon', 'Sui-Feng', 'Suifeng', 'Soifon'] },
        { name: 'Shunsui Kyoraku', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Brown', role: 'Shinigami', affiliation: 'Soul Society', age: 2000,
          ageLabel: '2000+', aliases: ['Shunsui', 'Kyoraku', 'Shunsui Kyoraku'] },
        { name: 'Jushiro Ukitake', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'White', role: 'Shinigami', affiliation: 'Soul Society', age: 2000,
          ageLabel: '2000+', aliases: ['Ukitake', 'Jushiro', 'Jushiro Ukitake'] },
        { name: 'Mayuri Kurotsuchi', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 350,
          ageLabel: '350+', aliases: ['Mayuri', 'Kurotsuchi', 'Mayuri Kurotsuchi'] },
        { name: 'Ikkaku Madarame', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Bald', role: 'Shinigami', affiliation: 'Soul Society', age: 300,
          ageLabel: '300+', aliases: ['Ikkaku', 'Madarame', 'Ikkaku Madarame'] },
        { name: 'Yumichika Ayasegawa', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 300,
          ageLabel: '300+', aliases: ['Yumichika', 'Ayasegawa'] },
        { name: 'Momo Hinamori', series: 'bleach', gender: 'Female', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 150,
          ageLabel: '150+', aliases: ['Momo', 'Hinamori', 'Momo Hinamori'] },
        { name: 'Izuru Kira', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Blonde', role: 'Shinigami', affiliation: 'Soul Society', age: 150,
          ageLabel: '150+', aliases: ['Kira', 'Izuru', 'Izuru Kira'] },
        { name: 'Shuhei Hisagi', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Soul Society', age: 150,
          ageLabel: '150+', aliases: ['Hisagi', 'Shuhei', 'Shuhei Hisagi'] },
        { name: 'Shinji Hirako', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Blonde', role: 'Shinigami', affiliation: 'Soul Society', age: 200,
          ageLabel: '200+', aliases: ['Shinji', 'Hirako', 'Shinji Hirako'] },
        { name: 'Isshin Kurosaki', series: 'bleach', gender: 'Male', species: 'Shinigami',
          hair: 'Black', role: 'Shinigami', affiliation: 'Karakura Town', age: 280,
          ageLabel: '280+', aliases: ['Isshin', 'Isshin Kurosaki'] },
        { name: 'Coyote Starrk', series: 'bleach', gender: 'Male', species: 'Arrancar',
          hair: 'Brown', role: 'Arrancar', affiliation: 'Hueco Mundo', age: 43,
          aliases: ['Starrk', 'Coyote Starrk'] },
        { name: 'Tier Harribel', series: 'bleach', gender: 'Female', species: 'Arrancar',
          hair: 'Blonde', role: 'Arrancar', affiliation: 'Hueco Mundo', age: 34,
          aliases: ['Harribel', 'Tier', 'Tier Harribel', 'Halibel'] },
        { name: 'Nnoitra Gilga', series: 'bleach', gender: 'Male', species: 'Arrancar',
          hair: 'Black', role: 'Arrancar', affiliation: 'Hueco Mundo', age: 25,
          aliases: ['Nnoitra', 'Gilga', 'Nnoitra Gilga'] },
        { name: 'Yhwach', series: 'bleach', gender: 'Male', species: 'Quincy',
          hair: 'Black', role: 'Quincy', affiliation: 'Wandenreich', age: 1000,
          ageLabel: '1000+', aliases: ['Yhwach', 'Juha Bach'] },

        // ============ Jujutsu Kaisen ============
        { name: 'Yuji Itadori', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Pink', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 15,
          aliases: ['Yuji', 'Itadori', 'Yuji Itadori'] },
        { name: 'Megumi Fushiguro', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 15,
          aliases: ['Megumi', 'Fushiguro', 'Megumi Fushiguro'] },
        { name: 'Nobara Kugisaki', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Orange', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 16,
          aliases: ['Nobara', 'Kugisaki', 'Nobara Kugisaki'] },
        { name: 'Satoru Gojo', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'White', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 28,
          aliases: ['Gojo', 'Satoru', 'Satoru Gojo', 'Gojo Satoru'] },
        { name: 'Maki Zenin', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 16,
          aliases: ['Maki', 'Zenin', 'Maki Zenin'] },
        { name: 'Toge Inumaki', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'White', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 17,
          aliases: ['Toge', 'Inumaki', 'Toge Inumaki'] },
        { name: 'Panda', series: 'jjk', gender: 'Male', species: 'Cursed Corpse',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 16,
          aliases: ['Panda'] },
        { name: 'Kento Nanami', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Blonde', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 28,
          aliases: ['Nanami', 'Kento', 'Kento Nanami'] },
        { name: 'Yuta Okkotsu', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 17,
          aliases: ['Yuta', 'Okkotsu', 'Yuta Okkotsu'] },
        { name: 'Aoi Todo', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Kyoto Jujutsu High', age: 18,
          aliases: ['Todo', 'Aoi', 'Aoi Todo'] },
        { name: 'Mai Zenin', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Kyoto Jujutsu High', age: 17,
          aliases: ['Mai', 'Mai Zenin'] },
        { name: 'Kasumi Miwa', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Kyoto Jujutsu High', age: 17,
          aliases: ['Miwa', 'Kasumi', 'Kasumi Miwa'] },
        { name: 'Suguru Geto', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Curse User', affiliation: 'Curses', age: 27,
          aliases: ['Geto', 'Suguru', 'Suguru Geto'] },
        { name: 'Choso', series: 'jjk', gender: 'Male', species: 'Curse',
          hair: 'Black', role: 'Curse User', affiliation: 'Curses', age: 150,
          ageLabel: '150+', aliases: ['Choso'] },
        { name: 'Sukuna', series: 'jjk', gender: 'Male', species: 'Curse',
          hair: 'Pink', role: 'Curse', affiliation: 'Curses', age: 1000,
          ageLabel: '1000+', aliases: ['Sukuna', 'Ryomen Sukuna', 'King of Curses'] },
        { name: 'Mahito', series: 'jjk', gender: 'Male', species: 'Curse',
          hair: 'Gray', role: 'Curse', affiliation: 'Curses', age: 2,
          aliases: ['Mahito'] },
        { name: 'Jogo', series: 'jjk', gender: 'Male', species: 'Curse',
          hair: 'Bald', role: 'Curse', affiliation: 'Curses', age: 3,
          aliases: ['Jogo'] },
        { name: 'Masamichi Yaga', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 47,
          aliases: ['Yaga', 'Masamichi', 'Masamichi Yaga'] },
        { name: 'Shoko Ieiri', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Brown', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 28,
          aliases: ['Shoko', 'Ieiri', 'Shoko Ieiri'] },
        { name: 'Kinji Hakari', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 18,
          aliases: ['Hakari', 'Kinji', 'Kinji Hakari'] },
        { name: 'Hiromi Higuruma', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 36,
          aliases: ['Higuruma', 'Hiromi', 'Hiromi Higuruma'] },
        { name: 'Takuma Ino', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Blonde', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 21,
          aliases: ['Ino', 'Takuma', 'Takuma Ino'] },
        { name: 'Yuki Tsukumo', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Blonde', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 33,
          aliases: ['Yuki', 'Tsukumo', 'Yuki Tsukumo'] },
        { name: 'Mei Mei', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Tokyo Jujutsu High', age: 30,
          aliases: ['Mei Mei', 'Meimei'] },
        { name: 'Utahime Iori', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Kyoto Jujutsu High', age: 31,
          aliases: ['Utahime', 'Iori', 'Utahime Iori'] },
        { name: 'Noritoshi Kamo', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Sorcerer', affiliation: 'Kyoto Jujutsu High', age: 17,
          aliases: ['Noritoshi', 'Kamo', 'Noritoshi Kamo'] },
        { name: 'Momo Nishimiya', series: 'jjk', gender: 'Female', species: 'Human',
          hair: 'Blonde', role: 'Sorcerer', affiliation: 'Kyoto Jujutsu High', age: 18,
          aliases: ['Momo Nishimiya', 'Nishimiya'] },
        { name: 'Naoya Zenin', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Curse User', affiliation: 'Zenin Clan', age: 28,
          aliases: ['Naoya', 'Naoya Zenin'] },
        { name: 'Toji Fushiguro', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Curse User', affiliation: 'Zenin Clan', age: 38,
          aliases: ['Toji', 'Toji Fushiguro'] },
        { name: 'Hajime Kashimo', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Purple', role: 'Sorcerer', affiliation: 'Curses', age: 400,
          ageLabel: '400+', aliases: ['Kashimo', 'Hajime', 'Hajime Kashimo'] },
        { name: 'Kenjaku', series: 'jjk', gender: 'Male', species: 'Human',
          hair: 'Black', role: 'Curse User', affiliation: 'Curses', age: 1000,
          ageLabel: '1000+', aliases: ['Kenjaku', 'Pseudo-Geto'] }
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

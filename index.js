const data = require('./data/collection2.json');
const dictionary = require('./data/dictionary.json');
const postingsLists = require('./data/postingsLists.json');

// const data = fetch('./data/collection2.json')
//     .then(response => response.json())
//     .then(json => { return json });

// const dictionary = fetch('./data/dictionary.json')
//     .then(response => response.json())
//     .then(json => { return json });

// const postingsLists = fetch('./data/postingsLists.json')
//     .then(response => response.json())
//     .then(json => { return json });

const form = document.getElementById("search");
const input = document.getElementById("input");

const a1 = document.getElementById("anime1");
const a1s = document.getElementById("anime1s");
const a1b = document.getElementById("anime1b");

const a2 = document.getElementById("anime2");
const a2s = document.getElementById("anime2s");
const a2b = document.getElementById("anime2b");

const a3 = document.getElementById("anime3");
const a3s = document.getElementById("anime3s");
const a3b = document.getElementById("anime3b");

const a4 = document.getElementById("anime4");
const a4s = document.getElementById("anime4s");
const a4b = document.getElementById("anime4b");

const a5 = document.getElementById("anime5");
const a5s = document.getElementById("anime5s");
const a5b = document.getElementById("anime5b");

const a6 = document.getElementById("anime6");
const a6s = document.getElementById("anime6s");
const a6b = document.getElementById("anime6b");

const a7 = document.getElementById("anime7");
const a7s = document.getElementById("anime7s");
const a7b = document.getElementById("anime7b");

const a8 = document.getElementById("anime8");
const a8s = document.getElementById("anime8s");
const a8b = document.getElementById("anime8b");

const a9 = document.getElementById("anime9");
const a9s = document.getElementById("anime9s");
const a9b = document.getElementById("anime9b");

const a10 = document.getElementById("anime10");
const a10s = document.getElementById("anime10s");
const a10b = document.getElementById("anime10b");

form.addEventListener("submit", handleQuery);

var CosineSimilarity = require('./src/cosineSimilarity.js');
var PageRank = require('./src/pageRank.js');

let cosSim = new CosineSimilarity(data, dictionary, postingsLists);
cosSim.loadStopWords("./data/common_words");

console.log("hello");

function handleQuery(event) {
    event.preventDefault();
    cosSim.setQuery(input.value);
    cosSim.run();
    // let pageRank = new PageRank(data, 0.1);
    // pageRank.createMatrix();
    // pageRank.calculateProbability(2);

    let finalScore = {};
    for (const [index, sim] of Object.entries(cosSim.relDocs)) {
        // finalScore[index] = (0.5 * sim) + (0.5 * pageRank.score[pageRank.references[index]]);
        finalScore[index] = (sim);
    }

    let items = Object.keys(finalScore).map(function (key) {
        return [key, finalScore[key]];
    });

    items.sort(function (first, second) {
        return second[1] - first[1];
    });

    console.log(items.slice(0, 10));

    let rank1 = getInfo(items[0][0]);
    let rank2 = getInfo(items[1][0]);
    let rank3 = getInfo(items[2][0]);
    let rank4 = getInfo(items[3][0]);
    let rank5 = getInfo(items[4][0]);
    let rank6 = getInfo(items[5][0]);
    let rank7 = getInfo(items[6][0]);
    let rank8 = getInfo(items[7][0]);
    let rank9 = getInfo(items[8][0]);
    let rank10 = getInfo(items[9][0]);

    a1.textContent = rank1["title"];
    a1s.textContent = rank1["synopsis"];
    a1b.textContent = rank1["background"];

    a2.textContent = rank2["title"];
    a2s.textContent = rank2["synopsis"];
    a2b.textContent = rank2["background"];

    a3.textContent = rank3["title"];
    a3s.textContent = rank3["synopsis"];
    a3b.textContent = rank3["background"];

    a4.textContent = rank4["title"];
    a4s.textContent = rank4["synopsis"];
    a4b.textContent = rank4["background"];

    a5.textContent = rank5["title"];
    a5s.textContent = rank5["synopsis"];
    a5b.textContent = rank5["background"];

    a6.textContent = rank6["title"];
    a6s.textContent = rank6["synopsis"];
    a6b.textContent = rank6["background"];

    a7.textContent = rank7["title"];
    a7s.textContent = rank7["synopsis"];
    a7b.textContent = rank7["background"];

    a8.textContent = rank8["title"];
    a8s.textContent = rank8["synopsis"];
    a8b.textContent = rank8["background"];

    a9.textContent = rank9["title"];
    a9s.textContent = rank9["synopsis"];
    a9b.textContent = rank9["background"];

    a10.textContent = rank10["title"];
    a10s.textContent = rank10["synopsis"];
    a10b.textContent = rank10["background"];
}

function getInfo(index) {
    for (const [group, animes] of Object.entries(data)) {
        for (const [key, anime] of Object.entries(animes)) {
            if (key === index) {
                return {
                    "title": anime["title"],
                    "synopsis": anime["synopsis"],
                    "background": anime["background"],
                };
            }
        }
    }
    return {
        "title": "No Info",
        "synopsis": "No Info",
        "background": "No Info",
    };
}
var data = require('./data/collection2.json');
var dictionary = require('./data/dictionary.json');
var postingsLists = require('./data/postingsLists.json');
var CosineSimilarity = require('./src/cosineSimilarity.js');
var PageRank = require('./src/pageRank.js');

let cosSim = new CosineSimilarity(data, dictionary, postingsLists);
cosSim.loadStopWords("./data/common_words");
cosSim.setQuery("attack on titan");
cosSim.run();

let pageRank = new PageRank(data, 0.1);
pageRank.createMatrix();
pageRank.calculateProbability(2);

let finalScore = {};
for (const [index, sim] of Object.entries(cosSim.relDocs)) {
    finalScore[index] = (0.5 * sim) + (0.5 * pageRank.score[pageRank.references[index]]);
}

let items = Object.keys(finalScore).map(function (key) {
    return [key, finalScore[key]];
});

items.sort(function (first, second) {
    return second[1] - first[1];
});

console.log(items.slice(0, 10));

for (const [index, score] of items.slice(0, 10)) {
    console.log(index, pageRank.score[pageRank.references[index]]);
}

var data = require('./data/collection2.json');
var dictionary = require('./data/dictionary.json');
var postingsLists = require('./data/postingsLists.json');
var CosineSimilarity = require('./src/cosineSimilarity.js');
var PageRank = require('./src/pageRank.js');

let cosSim = new CosineSimilarity(data, dictionary, postingsLists);
cosSim.loadStopWords("./data/common_words");
// cosSim.setQuery("This is a efficient magnitude poopy");
cosSim.setQuery("attack on titan");
cosSim.run();

console.log(cosSim.N);
console.log(cosSim.query);

var items = Object.keys(cosSim.relDocs).map(function (key) {
    return [key, cosSim.relDocs[key]];
});

items.sort(function (first, second) {
    return second[1] - first[1];
});

console.log(items.slice(0, 10));

let pageRank = new PageRank(data, 0.1);
pageRank.convertIndex();
pageRank.buildMatrix();
pageRank.directMatrix();
pageRank.updateMatrix();
// console.log(pageRank.reference);
// console.log(pageRank.N);
// console.log(pageRank.matrix[pageRank.references["1"]]);
pageRank.calculateProbability("group0", 2);
// console.log(pageRank.score);
for (const [index, score] of items.slice(0, 10)) {
    console.log(index, pageRank.score[pageRank.references[index]]);
}
// console.log(pageRank.matrix[pageRank.references["group0"]]);
// console.log(pageRank.matrix[pageRank.references["group19000"]]);

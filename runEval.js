var data = require('./data/collection2.json');
var dictionary = require('./data/dictionary.json');
var postingsLists = require('./data/postingsLists.json');
var CosineSimilarity = require('./src/cosineSimilarity.js');
var PageRank = require('./src/pageRank.js');

let cosSim = new CosineSimilarity(data, dictionary, postingsLists);
cosSim.loadStopWords("./data/common_words");
// cosSim.setQuery("This is a efficient magnitude poopy");
cosSim.setQuery("attack on titan");
// cosSim.setQuery("Garden: Takamine-ke no Nirinka - The Animation");
cosSim.getRelevantDocs();
cosSim.calculateIDF();
cosSim.calculateWeights();
cosSim.calculateSimilarity();

console.log(cosSim.query);

var items = Object.keys(cosSim.relDocs).map(function (key) {
    return [key, cosSim.relDocs[key]];
});

items.sort(function (first, second) {
    return second[1] - first[1];
});

console.log(items.slice(0, 10));

let cosSim = new CosineSimilarity(data, cosSim.relDocs);

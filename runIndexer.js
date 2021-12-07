var json = require('./data/collection.json');
var Invert = require('./src/invert.js');

let invertModel = new Invert(json);
invertModel.loadStopWords("./data/common_words");
invertModel.stem();
// console.log(invertModel.getAnime("1"));
invertModel.saveData("./data/collection2.json");
invertModel.createOutput("./data/dictionary.json", "./data/postingsLists.json");

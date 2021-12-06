var json = require('./data/collection.json');
var invert = require('./src/invert');

let invertModel = new invert(json);
invertModel.loadStopWords("./data/common_words");
invertModel.stem();
// console.log(invertModel.getAnime("1"));
invertModel.saveData("./data/collection2.json");

const stemmer = require('porter-stemmer').stemmer;

console.log(stemmer("magnitude world"));

// const fs = require('fs');
// var json = require('../data/collection.json');

// let scrapedData = {}
// for (const [key, value] of Object.entries(json)) {
//     scrapedData[key] = {}
//     for (const [index, anime] of Object.entries(value)) {
//         if (anime["altTitle"].length > 1) {
//             console.log(index, anime["altTitle"].length);
//         }
//         let altTitle;
//         if (anime["altTitle"].length) {
//             altTitle = anime["altTitle"];
//         }
//         else {
//             altTitle = "";
//         }
//         scrapedData[key][index] = {
//             "title": anime["title"],
//             "altTitle": altTitle,
//             "engTitle": anime["engTitle"],
//             "synopsis": anime["synopsis"],
//             "background": anime["background"],
//             "related": anime["related"],
//         };
//     }
// }

// fs.writeFileSync("./data/collection.json", JSON.stringify(scrapedData));

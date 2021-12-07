const stemmer = require('porter-stemmer').stemmer;
const fs = require('fs');

class Invert {
    constructor(data) {
        this.data = data;
        this.stopWords = [];
    }

    loadStopWords(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8')
            this.stopWords = data.split("\r\n");
        } catch (err) {
            console.error(err)
        }
    }

    stem() {
        for (const [group, animes] of Object.entries(this.data)) {
            for (const [index, anime] of Object.entries(animes)) {
                let text = `${anime["title"]} ${anime["engTitle"]} ${anime["synopsis"]} ${anime["background"]} ${(anime["altTitle"].join(" "))}`.toLowerCase();
                text = this.parse(text);
                text = this.removeStopWords(text);
                text = this.stemWords(text);
                this.data[group][index]["stemmed"] = text;
            }
        }
    }

    parse(text) {
        const chars = ["'s", "'", "-", ".", "(", ")", "{", "}", "[", "]", ":", ";", ",", '"', "*", "/", "?", "!", "$", "`", "~"];
        const operators = {
            "<=": " less than or equal to ",
            ">=": " greater than or equal to ",
            "=": " equal to ",
            "<": " less than ",
            ">": " greater than ",
            "+": " add ",
            "^": " raised to the power of ",
            "&": " and ",
            "%": " percent ",
            "+": " plus ",
        }
        for (let i = 0; i < chars.length; i++) {
            text = text.replaceAll(chars[i], " ");
        }
        for (const [op, phrase] of Object.entries(operators)) {
            text = text.replaceAll(op, phrase);
        }
        return text.split(" ").filter(e => e);
    }

    removeStopWords(text) {
        for (let i = 0; i < this.stopWords.length; i++) {
            for (let j = 0; j < text.length; j++) {
                if (text[j] === this.stopWords[i]) {
                    text.splice(j, 1, "");
                }
            }
        }
        return text.filter(e => e);
    }

    stemWords(text) {
        let result = [];
        for (let i = 0; i < text.length; i++) {
            result.push(stemmer(text[i]));
        }
        return result;
    }

    getAnime(searchIndex) {
        for (const [group, animes] of Object.entries(this.data)) {
            for (const [index, anime] of Object.entries(animes)) {
                if (index === searchIndex) {
                    return anime;
                }
            }
        }
        return "No anime";
    }

    saveData(filePath) {
        fs.writeFileSync(filePath, JSON.stringify(this.data));
    }

    createOutput(dictPath, postingsPath) {
        let dictionary = {};
        let postingsList = {};
        for (const [group, animes] of Object.entries(this.data)) {
            for (const [index, anime] of Object.entries(animes)) {
                let position = 1;
                let seen = new Set();
                anime["stemmed"].forEach((term) => {
                    if (!dictionary[term]) dictionary[term] = 0;
                    if (!seen.has(term)) dictionary[term] += 1;
                    if (!postingsList[term]) postingsList[term] = {}
                    if (!postingsList[term][index]) postingsList[term][index] = [];
                    postingsList[term][index].push(position);
                    position++;
                    seen.add(term);
                })
            }
        }
        fs.writeFileSync(dictPath, JSON.stringify(dictionary));
        fs.writeFileSync(postingsPath, JSON.stringify(postingsList));
    }
}

module.exports = Invert;

const stemmer = require('porter-stemmer').stemmer;
const fs = require('fs');

class CosineSimilarity {
    constructor(data, dictionary, postingsLists) {
        this.data = data;
        this.dictionary = dictionary;
        this.postingsLists = postingsLists;
        this.stopWords = [];
        this.N = 0;
        this.query = [];
        this.queryWeight = {};
        this.relDocs = {};
        this.IDF = {};
    }

    run() {
        this.getRelevantDocs();
        this.calculateIDF();
        this.calculateWeights();
        this.calculateSimilarity();
    }

    loadStopWords(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8')
            this.stopWords = data.split("\r\n");
        } catch (err) {
            console.error(err)
        }
    }

    setQuery(text) {
        text = this.parse(text.toLowerCase());
        text = this.removeStopWords(text);
        text = this.stemWords(text);
        this.query = text;
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

    getRelevantDocs() {
        this.relDocs = {};
        let seen = new Set();
        for (const word of this.query) {
            if (seen.has(word)) continue;
            if (this.postingsLists[word]) {
                for (const [index, positions] of Object.entries(this.postingsLists[word])) {
                    if (!this.relDocs[index]) this.relDocs[index] = {};
                    this.relDocs[index][word] = 0;
                }
            }
            seen.add(word);
        }
    }

    calculateIDF() {
        this.N = 0;
        this.IDF = {};
        for (const [group, animes] of Object.entries(this.data)) {
            this.N += Object.keys(animes).length;
        }
        for (const [index, words] of Object.entries(this.relDocs)) {
            for (const word of Object.keys(words)) {
                if (this.IDF[word]) continue;
                let df = this.dictionary[word];
                this.IDF[word] = Math.log10(this.N / df);
            }
        }
    }

    calculateWeights() {
        for (const [index, words] of Object.entries(this.relDocs)) {
            let seen = new Set();
            for (const word of Object.keys(words)) {
                if (seen.has(word)) continue;
                let f = this.getFrequency(index, word);
                let tf = 1 + Math.log10(f);
                this.relDocs[index][word] = tf * this.IDF[word];
                seen.add(word);
            }
        }
        this.queryWeight = {};
        let seen = new Set();
        for (const word of this.query) {
            if (!this.IDF[word]) continue;
            let f = this.query.filter(x => x == word).length;
            let tf = 1 + Math.log10(f);
            this.queryWeight[word] = tf * this.IDF[word];
            seen.add(word);
        }
    }

    getFrequency(index, word) {
        for (const [group, animes] of Object.entries(this.data)) {
            if (!animes[index]) continue;
            return animes[index]["stemmed"].filter(x => x == word).length;
        }
        return 0;
    }

    calculateSimilarity() {
        for (const [index, words] of Object.entries(this.relDocs)) {
            let num = 0;
            for (const [qWord, qWeight] of Object.entries(this.queryWeight)) {
                if (words[qWord]) {
                    num += words[qWord] * qWeight;
                }
            }
            let den = this.calculateMagnitude(index);
            this.relDocs[index] = (num / den);
        }
    }

    calculateMagnitude(index) {
        let docMag = 0;
        for (const [group, animes] of Object.entries(this.data)) {
            if (!animes[index]) continue;
            let seen = new Set();
            for (const word of animes[index]["stemmed"]) {
                let f = animes[index]["stemmed"].filter(x => x == word).length;
                let tf = 1 + Math.log10(f);
                docMag += (tf * Math.log10(this.N / this.dictionary[word])) ** 2;
                seen.add(word);
            }
        }
        let qMag = 0;
        for (const [word, weight] of Object.entries(this.queryWeight)) {
            qMag += weight ** 2;
        }
        // console.log(docMag, qMag, (docMag ** 0.5), (qMag ** 0.5));
        return (docMag ** 0.5) * (qMag ** 0.5);
    }
}

module.exports = CosineSimilarity;

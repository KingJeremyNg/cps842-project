const fs = require('fs');

class PageRank {
    constructor(data, alpha) {
        this.data = data;
        this.alpha = alpha;
        this.references = {};
        this.N = 0;
        this.matrix = [];
        this.score = [];
    }

    convertIndex() {
        this.references = {};
        let position = 0;
        for (const [group, animes] of Object.entries(this.data)) {
            this.references[group] = position;
            position++;
            for (const [index, anime] of Object.entries(animes)) {
                this.references[index] = position;
                position++;
            }
        }
    }

    buildMatrix() {
        this.matrix = [];
        this.N = Object.keys(this.references).length;
        for (let i = 0; i < this.N; i++) {
            this.matrix.push(new Array(this.N).fill(0));
        }
    }

    directMatrix() {
        let prev = null;
        for (const [group, animes] of Object.entries(this.data)) {
            if (prev) {
                this.matrix[this.references[prev]][this.references[group]] = 1;
                this.matrix[this.references[group]][this.references[prev]] = 1;
            }
            prev = group;
            for (const [index, anime] of Object.entries(animes)) {
                this.matrix[this.references[group]][this.references[index]] = 1;
                for (const related of anime["related"]) {
                    this.matrix[this.references[index]][this.references[related]] = 1;
                }
            }
        }
    }

    updateMatrix() {
        for (let i = 0; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                this.matrix[i][j] /= this.N;
                this.matrix[i][j] *= (1 - this.alpha);
                this.matrix[i][j] += (this.alpha / this.N);
            }
        }
    }

    calculateProbability(start, iterations) {
        let x = this.matrix[this.references[start]];
        let result = this.matrix[this.references[start]];
        for (let i = 1; i < iterations; i++) {
            result = []
            for (let j = 0; j < this.N; j++) {
                let sum = 0;
                for (let k = 0; k < this.N; k++) {
                    sum += x[j] * this.matrix[this.references[start]][k];
                }
                result.push(sum);
            }
            x = result;
        }
        this.score = result;
    }
}

module.exports = PageRank;

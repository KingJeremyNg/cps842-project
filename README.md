# Table of Contents
* [Introduction](#introduction)
* [Dependencies](#dependencies)
* [Installation](#installation)
* [Usage](#usage)
* [Methods](#methods)
* [Examples](#examples)

# Introduction
This is a `javascript` project using `PageRank` and `CosineSimilarity` to evaluate anime scraped from `myanimelist.com`.

# Dependencies
This project is created with:
* javascript
* puppeteer
* porter-stemmer
* browserify

# Installation
Download project files using git:
```
$ git clone https://github.com/KingJeremyNg/cps842-project
```
Install dependencies using npm:
```
$ npm install puppeteer
$ npm install porter-stemmer
$ npm install browserify
```

# Usage
To run this project, install the files dependencies locally and run using `npm` command line within the main directory. Below are the following scripts.

Scraping `myanimelist.com` top anime:  
NOTE - Scraper will take 15+ hours to scrape 19,000 anime unless you manually add a breakpoint in `src/scraper.js`
```
$ npm run scraper
```

Building the inverted index and create `dictionary.json` and `postingsLists.json`:
```
$ npm run index
```

Run `CosineSimilarity` and `PageRank` on query:  
NOTE - Change the query manually in `cosSim.setQuery("attack on titan");` on `runEval.js: Line 9`
```
$ npm run eval
```

Bundle `Node` code for browser compatibility:
```
$ npm run bundle
```

# Methods
##### Scraper
Uses `puppeteer` to scrape `myanimelist.com` using its top anime index. Information retrieved include: `title`, `english title`, `alternate titles`, `synopsis`, `background` and `related anime`. All data are stored into a dictionary file: `collection.json`.
##### Inverted Index (Vector Space Model)
Parses data from `collection.json` and stem every word for each anime. Also counts `document frequency` for each term and stores `position` information. Creates files: `collections2.json`, `dictionary.json` and `postingsLists.json`.
##### Cosine Similarity
Apply `Cosine Similarity` on data from `collection2.json` given query. Returns a `dictionary` of `relevant documents` in `(index, score)` pairs stored in variable `relDocs`.
##### Page Rank
`pageRank.js` initializes a matrix of size `N^2` using data from `collection2.json`. However it must create a `reference` dictionary because the indexes are not `continuous`. Update matrix using `related` anime from each entry of data. Then apply normalization and calculate probabilities using `PageRank` algorithm with a `random` starting page and maximum `2 iterations`.  
NOTE - results are `normalized` using `maximum` number such that results do not exceed `1` due to my matrix being size `19000^2`.
##### Evaluation
Given a query, run `Cosine Similarity` and `Page Rank`. Retrieve results from `Cosine Similarity` and `sort` by `score`. Using the `top 10` relevant documents from `Cosine Similarity`, get its `Page Rank score`. Final score is then calculated using `score(d, q) = w1 * cos-score(d, q) + w2 * pagerank(d) where w1 + w2 = 1`.
##### Browser implementation
Uses `browserify` to convert all `Node` code to be compatible with `HTML`. Browser interface is very simple, using `form` and `table` tags. Enter a query in the `search bar` and press `Enter`. The page will be populated with the `top 10 anime` after `evaluation`.  
NOTE - With a matrix size of `19000^2`, probabilities are for each anime are `extremely low`. It also uses `too much memory` in the browser and `crashes`. For this reason, I decided to remove `PageRank` from the browser implementation.

# Examples
Example screenshots of browser interface can be found in the `screenshots` directory.

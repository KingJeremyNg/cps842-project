const stemmer = require('porter-stemmer').stemmer

const scraperObject = {
    url: 'https://myanimelist.net/topanime.php?limit=0',
    scrapedData: {},

    async scraper(browser) {
        let urls = []
        while (true) {
            let page = await browser.newPage();
            console.log(`Navigating to ${this.url}`);
            // Navigate to the selected page
            await page.goto(this.url);
            // Wait for the required DOM to be rendered
            await page.waitForSelector('.pb12');
            // Get the links to all anime
            urls.push(...await page.$$eval('table > tbody > tr > td > a', links => {
                // Remove login links
                links = links.filter(link => !link.href.includes("error=login"));
                // Extract the links from the data
                links = links.map(el => el.href);
                return links;
            }));
            // Get the next page link
            this.url = await page.$$eval('div > h2 > span > a', links => {
                try {
                    return links.filter(link => link.textContent.includes("Next 50"))[0].href;
                }
                catch (err) {
                    return ""
                }
            });
            await page.close();
            if (!this.url) break;
            if (this.url == "https://myanimelist.net/topanime.php?limit=50") break;
        }
        // console.log(urls);
        // console.log(urls.length);

        let pagePromise = (link) => new Promise(async (resolve, reject) => {
            // let data = {};
            let page = await browser.newPage();
            await page.goto(link);
            await page.waitForSelector('#contentWrapper');
            let data = await page.evaluate(() => {
                let scraped = {}
                scraped['title'] = document.querySelector('.title-name').textContent;
                scraped['synopsis'] = document.querySelector('.js-scrollfix-bottom-rel > table > tbody > tr > td > p').textContent;
                let background = document.querySelector('.js-scrollfix-bottom-rel > table > tbody > tr > td');
                // background.querySelectorAll('div, p').forEach(element => {
                //     background.removeChild(element.firstChild);
                // })
                let start = background.textContent.search("EditBackground") + "EditBackground".length;
                let end = background.textContent.search("More VideosEpisode Videos\n")
                background = background.textContent.slice(start, end);
                scraped['background'] = "";
                if (!background.startsWith("No background")) {
                    scraped['background'] = background;
                }
                return scraped;
            })
            await page.close();
            resolve(data);
        })

        for (link in urls) {
            if (link == 3) {
                break;
            }
            console.log(`Navigating to ${urls[link]}`);
            let currentPageData = await pagePromise(urls[link]);
            let index = urls[link].split("/")[4];
            // console.log(index);
            this.scrapedData[index] = currentPageData;
            // console.log(currentPageData)
        }
        console.log(this.scrapedData);
    }
}

module.exports = scraperObject;

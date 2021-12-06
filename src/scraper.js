const stemmer = require('porter-stemmer').stemmer;
const fs = require('fs');

const scraperObject = {
    url: 'https://myanimelist.net/topanime.php?limit=0',
    scrapedData: {},

    async scraper(browser) {
        while (true) {
            let urls = [];
            let page = await browser.newPage();
            await page.setDefaultNavigationTimeout(0);
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

            // Get information of anime on page
            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let page = await browser.newPage();
                await page.setDefaultNavigationTimeout(0);
                await page.goto(link);
                await page.waitForSelector('#contentWrapper', {timeout: 0});
                let data = await page.evaluate(() => {
                    let scraped = {}

                    scraped['title'] = document.querySelector('.title-name').textContent;

                    scraped['engTitle'] = "";
                    let engTitle = document.querySelector(".title-english");
                    if (engTitle) scraped['engTitle'] = engTitle.textContent;

                    scraped['synopsis'] = "";
                    let synopsis = document.querySelector('.js-scrollfix-bottom-rel > table > tbody > tr > td > p');
                    if (synopsis) scraped['synopsis'] = synopsis.textContent.replace(/^\s+|\s+$/g, '');

                    let background = document.querySelector('.js-scrollfix-bottom-rel > table > tbody > tr > td');
                    let start = background.textContent.search("EditBackground") + "EditBackground".length;
                    let end = background.textContent.search("More VideosEpisode Videos\n");
                    background = background.textContent.slice(start, end);
                    scraped['background'] = "";
                    if (!background.startsWith("No background")) scraped['background'] = background.replace(/^\s+|\s+$/g, '');

                    scraped['related'] = [];
                    document.querySelectorAll('.anime_detail_related_anime > tbody > tr > td:nth-child(2) > a').forEach((el) => {
                        let temp = el.href.split("/");
                        if (temp[3] == "anime") scraped['related'].push(temp[4]);
                    });

                    scraped['altTitle'] = [];
                    document.querySelectorAll('.js-alternative-titles > div').forEach((el) => {
                        let title = el.textContent.replace(/^\s+|\s+$/g, '').split(" ");
                        title.shift();
                        scraped['altTitle'].push(title.join(" "));
                    });

                    return scraped;
                })

                await page.close();
                resolve(data);
            })

            for (link in urls) {
                // if (link == 3) {
                //     break;
                // }
                console.log(`Navigating to ${urls[link]}`);
                let currentPageData = await pagePromise(urls[link]);
                let index = urls[link].split("/")[4];
                this.scrapedData[index] = currentPageData;
            }

            if (!this.url) break;
            // if (this.url == "https://myanimelist.net/topanime.php?limit=50") break;
        }

        fs.writeFileSync("./data/collection.json", JSON.stringify(this.scrapedData));

        // console.log(this.scrapedData);
        // console.log(typeof(this.scrapedData['38524']['synopsis']))
        // console.log(this.scrapedData['38524']['synopsis'])
        // console.log(typeof(this.scrapedData['38524']['related']))
        // console.log(this.scrapedData['38524']['related'])
    }
}

module.exports = scraperObject;

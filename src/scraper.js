const scraperObject = {
    url: 'https://myanimelist.net/topanime.php?limit=0',
    async scraper(browser) {
        let urls = []
        while (true) {
            let page = await browser.newPage();
            console.log(`Navigating to ${this.url}...`);
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
                    links = links.filter(link => link.textContent.includes("Next 50"));
                    return links[0].href;
                }
                catch (err) {
                    return ""
                }
            });
            if (!this.url) break;
            // if (this.url == "https://myanimelist.net/topanime.php?limit=50") break;
        }
        console.log(urls);
        console.log(urls.length);
    }
}

module.exports = scraperObject;

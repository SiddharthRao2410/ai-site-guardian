const { chromium } = require("playwright");

async function crawlWebsite(startUrl) {

    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage({
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    });

    /*
     STORE VISITED URLS
    */
    const visited = new Set();

    /*
     STORE ALL PAGE DATA
    */
    const pagesData = [];

    /*
     GET DOMAIN
    */
    const domain = new URL(startUrl).origin;

    /*
     LIMIT PAGE SCANNING
    */
    const MAX_PAGES = 10;

    /*
     RECURSIVE PAGE SCANNER
    */
    async function scanPage(url) {

        /*
         SKIP IF ALREADY VISITED
        */
        if (visited.has(url)) {
            return;
        }

        /*
         LIMIT MAX PAGES
        */
        if (visited.size >= MAX_PAGES) {
            return;
        }

        visited.add(url);

        console.log("Scanning:", url);

        try {

            /*
             OPEN PAGE
            */
            await page.goto(url, {
                waitUntil: "domcontentloaded",
                timeout: 30000
            });

            /*
             WAIT FOR PAGE TO RENDER
            */
            await page.waitForTimeout(2000);

            console.log("Page loaded:", url);

            /*
             PAGE TITLE
            */
            const title = await page.title();

            /*
             EXTRACT BUTTONS
            */
            const buttons = await page.$$eval("button", buttons =>
                buttons.map(btn => ({
                    text: btn.innerText,
                    type: btn.type
                }))
            );

            /*
             EXTRACT FORMS
            */
            const forms = await page.$$eval("form", forms =>
                forms.map(form => ({
                    action: form.action,
                    method: form.method
                }))
            );

            /*
             EXTRACT LINKS
            */
            const links = await page.$$eval("a", links =>
                links.map(link => ({
                    text: link.innerText,
                    href: link.href
                }))
            );

            /*
             SCREENSHOT FILE NAME
            */
            const fileName =
                "screenshot-" +
                visited.size +
                ".png";

            /*
             CAPTURE SCREENSHOT
            */
            await page.screenshot({
                path: fileName,
                fullPage: true
            });

            console.log("Screenshot saved:", fileName);

            /*
             STORE PAGE DATA
            */
            pagesData.push({
                url,
                title,
                buttons,
                forms,
                links,
                screenshot: fileName
            });

            /*
             FIND INTERNAL LINKS
            */
            for (const link of links) {

                if (
                    link.href &&
                    link.href.startsWith(domain)
                ) {

                    /*
                     REMOVE HASHES
                    */
                    const cleanUrl =
                        link.href.split("#")[0];

                    /*
                     SCAN NEXT PAGE
                    */
                    await scanPage(cleanUrl);

                }

            }

        } catch (error) {

            console.log("FAILED:", url);

            console.log(error);

        }

    }

    /*
     START CRAWLING
    */
    await scanPage(startUrl);

    /*
     CLOSE BROWSER
    */
    await browser.close();

    /*
     RETURN FINAL DATA
    */
    return {
        totalPages: pagesData.length,
        pages: pagesData
    };

}

module.exports = {
    crawlWebsite
};
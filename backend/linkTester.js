const { chromium } =
    require("playwright");

/*
 BROKEN LINK TESTER
*/
async function testBrokenLinks(
    pages
) {

    const browser =
        await chromium.launch({
            headless: true
        });

    const page =
        await browser.newPage();

    /*
     RESULTS
    */
    const results = [];

    /*
     LOOP THROUGH PAGES
    */
    for (const pageData of pages) {

        try {

            console.log(
                "Testing link:",
                pageData.url
            );

            const response =
                await page.goto(
                    pageData.url,
                    {
                        waitUntil:
                            "domcontentloaded",
                        timeout: 20000
                    }
                );

            /*
             STATUS CODE
            */
            const status =
                response.status();

            /*
             SUCCESS
            */
            if (status >= 200 &&
                status < 400) {

                results.push({

                    url: pageData.url,

                    status: "passed",

                    httpStatus: status

                });

            } else {

                results.push({

                    url: pageData.url,

                    status: "failed",

                    httpStatus: status

                });

            }

        } catch (error) {

            results.push({

                url: pageData.url,

                status: "failed",

                reason: error.message

            });

        }

    }

    await browser.close();

    return results;

}

module.exports = {
    testBrokenLinks
};
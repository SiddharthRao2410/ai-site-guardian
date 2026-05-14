const { chromium } =
    require("playwright");

/*
 PERFORMANCE TESTER
*/
async function testPerformance(
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
                "Performance testing:",
                pageData.url
            );

            /*
             START TIMER
            */
            const start =
                Date.now();

            /*
             OPEN PAGE
            */
            await page.goto(
                pageData.url,
                {
                    waitUntil:
                        "load",
                    timeout: 30000
                }
            );

            /*
             END TIMER
            */
            const end =
                Date.now();

            /*
             LOAD TIME
            */
            const loadTime =
                end - start;

            /*
             RESOURCE COUNT
            */
            const resourceCount =
                await page.evaluate(() => {

                    return performance
                        .getEntriesByType(
                            "resource"
                        ).length;

                });

            /*
             DOM SIZE
            */
            const domSize =
                await page.evaluate(() => {

                    return document
                        .querySelectorAll("*")
                        .length;

                });

            /*
             PERFORMANCE SCORE
            */
            let performanceRating =
                "good";

            if (loadTime > 5000) {

                performanceRating =
                    "poor";

            } else if (
                loadTime > 3000
            ) {

                performanceRating =
                    "average";

            }

            /*
             STORE RESULTS
            */
            results.push({

                page:
                    pageData.url,

                loadTime,

                resourceCount,

                domSize,

                performanceRating

            });

        } catch (error) {

            results.push({

                page:
                    pageData.url,

                status:
                    "failed",

                reason:
                    error.message

            });

        }

    }

    await browser.close();

    return results;

}

module.exports = {
    testPerformance
};
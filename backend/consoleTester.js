const { chromium } =
    require("playwright");

/*
 CONSOLE ERROR TESTER
*/
async function testConsoleErrors(
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
     CAPTURE CONSOLE ERRORS
    */
    const consoleErrors = [];

    /*
     CAPTURE FAILED REQUESTS
    */
    const failedRequests = [];

    /*
     LISTENERS
    */
    page.on("console", msg => {

        if (
            msg.type() === "error"
        ) {

            consoleErrors.push({

                type: "console-error",

                message:
                    msg.text()

            });

        }

    });

    page.on(
        "requestfailed",
        request => {

            failedRequests.push({

                url:
                    request.url(),

                failure:
                    request.failure()
                        ?.errorText

            });

        }
    );

    /*
     LOOP THROUGH PAGES
    */
    for (const pageData of pages) {

        try {

            console.log(
                "Analyzing console on:",
                pageData.url
            );

            /*
             OPEN PAGE
            */
            await page.goto(
                pageData.url,
                {
                    waitUntil:
                        "domcontentloaded",
                    timeout: 20000
                }
            );

            await page.waitForTimeout(
                3000
            );

            /*
             STORE RESULTS
            */
            results.push({

                page:
                    pageData.url,

                consoleErrors:
                    [...consoleErrors],

                failedRequests:
                    [...failedRequests]

            });

            /*
             CLEAR ARRAYS
            */
            consoleErrors.length = 0;

            failedRequests.length = 0;

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
    testConsoleErrors
};
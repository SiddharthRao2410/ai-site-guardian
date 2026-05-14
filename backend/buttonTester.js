const { chromium } =
    require("playwright");

const {

    findWorkingSelector,

    generateSelectorOptions

} = require(
    "./selectorHealer"
);

/*
 BUTTON INTERACTION TESTER
*/
async function testButtons(
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
                "Checking buttons on:",
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

            await page.waitForTimeout(2000);

            /*
             FIND BUTTONS
            */
            const buttons =
                await page.$$("button");

            console.log(
                "Buttons found:",
                buttons.length
            );

            /*
             TEST FIRST 5 BUTTONS
            */
            for (
                let i = 0;
                i < Math.min(
                    buttons.length,
                    5
                );
                i++
            ) {

                try {

                    /*
                     BUTTON TEXT
                    */
                    const buttonText =
                        await buttons[i]
                            .innerText();

                    /*
                     CLICK BUTTON
                    */

                    /*
                     GENERATE SELECTORS
                    */
                    const selectorOptions =
                        generateSelectorOptions(
                            buttonText
                        );

                    /*
                     FIND WORKING SELECTOR
                    */
                    const workingSelector =
                        await findWorkingSelector(
                            page,
                            selectorOptions
                        );

                    /*
                     CLICK USING HEALED SELECTOR
                    */
                    if (workingSelector) {

                        await page.click(
                            workingSelector,
                            {
                                timeout: 5000
                            }
                        );

                    } else {

                        throw new Error(
                            "No working selector found"
                        );

                    }

                    await page.waitForTimeout(
                        1500
                    );

                    /*
                     CAPTURE URL AFTER CLICK
                    */
                    const newUrl =
                        page.url();

                    results.push({

                        page:
                            pageData.url,

                        button:
                            buttonText || "No Text",

                        status: "passed",

                        navigatedTo:
                            newUrl

                    });

                } catch (error) {

                    results.push({

                        page:
                            pageData.url,

                        button:
                            "Unknown",

                        status: "failed",

                        reason:
                            error.message

                    });

                }

            }

        } catch (error) {

            results.push({

                page:
                    pageData.url,

                status: "failed",

                reason:
                    error.message

            });

        }

    }

    await browser.close();

    return results;

}

module.exports = {
    testButtons
};
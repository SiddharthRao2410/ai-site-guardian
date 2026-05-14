const { chromium } =
    require("playwright");

/*
 ACCESSIBILITY TESTER
*/
async function testAccessibility(
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
                "Accessibility testing:",
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
                2000
            );

            /*
             FIND IMAGES WITHOUT ALT
            */
            const imagesWithoutAlt =
                await page.$$eval(
                    "img",
                    imgs =>
                        imgs.filter(
                            img =>
                                !img.alt
                        ).length
                );

            /*
             FIND INPUTS WITHOUT LABELS
            */
            const unlabeledInputs =
                await page.$$eval(
                    "input",
                    inputs =>
                        inputs.filter(
                            input => {

                                const id =
                                    input.id;

                                if (!id)
                                    return true;

                                const label =
                                    document.querySelector(
                                        `label[for="${id}"]`
                                    );

                                return !label;

                            }
                        ).length
                );

            /*
             FIND EMPTY BUTTONS
            */
            const emptyButtons =
                await page.$$eval(
                    "button",
                    buttons =>
                        buttons.filter(
                            btn =>
                                !btn.innerText
                                    .trim()
                        ).length
                );

            /*
             STORE RESULTS
            */
            results.push({

                page:
                    pageData.url,

                imagesWithoutAlt,

                unlabeledInputs,

                emptyButtons,

                accessibilityPassed:

                    imagesWithoutAlt === 0 &&

                    unlabeledInputs === 0 &&

                    emptyButtons === 0

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
    testAccessibility
};
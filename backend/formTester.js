const { chromium } =
    require("playwright");

/*
 FORM VALIDATION TESTER
*/
async function testForms(
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
                "Checking forms on:",
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
             FIND FORMS
            */
            const forms =
                await page.$$("form");

            console.log(
                "Forms found:",
                forms.length
            );

            /*
             TEST EACH FORM
            */
            for (
                let i = 0;
                i < forms.length;
                i++
            ) {

                try {

                    /*
                     FIND SUBMIT BUTTON
                    */
                    const submitButton =
                        await forms[i].$(
                            'button[type="submit"], input[type="submit"]'
                        );

                    /*
                     FIND INPUTS
                    */
                    const inputs =
                        await forms[i].$$(
                            "input"
                        );

                    /*
                     FILL INVALID DATA
                    */
                    for (
                        let j = 0;
                        j < inputs.length;
                        j++
                    ) {

                        const type =
                            await inputs[j]
                                .getAttribute(
                                    "type"
                                );

                        /*
                         EMAIL INPUT
                        */
                        if (
                            type === "email"
                        ) {

                            await inputs[j]
                                .fill(
                                    "invalid-email"
                                );

                        }

                        /*
                         PASSWORD INPUT
                        */
                        else if (
                            type === "password"
                        ) {

                            await inputs[j]
                                .fill("123");

                        }

                        /*
                         TEXT INPUT
                        */
                        else {

                            await inputs[j]
                                .fill("test");

                        }

                    }

                    /*
                     SUBMIT FORM
                    */
                    if (submitButton) {

                        await submitButton
                            .click();

                        await page.waitForTimeout(
                            2000
                        );

                        /*
                         CAPTURE VALIDATION
                        */
                        const validationText =
                            await page.textContent(
                                "body"
                            );

                        results.push({

                            page:
                                pageData.url,

                            formNumber:
                                i + 1,

                            status:
                                "tested",

                            validationDetected:
                                validationText
                                    .toLowerCase()
                                    .includes(
                                        "invalid"
                                    ) ||
                                validationText
                                    .toLowerCase()
                                    .includes(
                                        "required"
                                    ) ||
                                validationText
                                    .toLowerCase()
                                    .includes(
                                        "error"
                                    )

                        });

                    }

                } catch (error) {

                    results.push({

                        page:
                            pageData.url,

                        formNumber:
                            i + 1,

                        status:
                            "failed",

                        reason:
                            error.message

                    });

                }

            }

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
    testForms
};
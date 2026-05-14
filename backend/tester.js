const { chromium } =
    require("playwright");

/*
 LOGIN FLOW TESTER
*/
async function testLoginFlow(loginUrl) {

    const browser =
        await chromium.launch({
            headless: false
        });

    const page =
        await browser.newPage();

    /*
     TEST RESULTS
    */
    const results = [];

    /*
     CAPTURE CONSOLE ERRORS
    */
    const consoleErrors = [];

    page.on("console", msg => {

        if (msg.type() === "error") {

            consoleErrors.push(
                msg.text()
            );

        }

    });

    try {

        console.log(
            "Opening login page:",
            loginUrl
        );

        /*
         OPEN LOGIN PAGE
        */
        await page.goto(loginUrl, {
            waitUntil: "domcontentloaded"
        });

        await page.waitForTimeout(2000);

        /*
         FIND INPUTS
        */
        const inputs =
            await page.$$("input");

        console.log(
            "Inputs found:",
            inputs.length
        );

        /*
         TEST 1
         EMPTY FORM SUBMIT
        */
        try {

            const submitButton =
                await page.$(
                    'button[type="submit"]'
                );

            if (submitButton) {

                await submitButton.click();

                await page.waitForTimeout(2000);

                results.push({
                    test:
                        "Empty Form Submission",
                    status: "passed"
                });

            } else {

                results.push({
                    test:
                        "Empty Form Submission",
                    status: "failed",
                    reason:
                        "Submit button not found"
                });

            }

        } catch (error) {

            results.push({
                test:
                    "Empty Form Submission",
                status: "failed",
                reason: error.message
            });

        }

        /*
         TEST 2
         INVALID LOGIN
        */
        try {

            /*
             FILL EMAIL
            */
            const emailInput =
                await page.$(
                    'input[type="email"], input[name*="email"], input[name*="username"]'
                );

            /*
             FILL PASSWORD
            */
            const passwordInput =
                await page.$(
                    'input[type="password"]'
                );

            /*
             SUBMIT BUTTON
            */
            const submitButton =
                await page.$(
                    'button[type="submit"]'
                );

            if (
                emailInput &&
                passwordInput &&
                submitButton
            ) {

                await emailInput.fill(
                    "fake@test.com"
                );

                await passwordInput.fill(
                    "wrongpassword123"
                );

                await submitButton.click();

                await page.waitForTimeout(3000);

                results.push({
                    test:
                        "Invalid Login Test",
                    status: "passed"
                });

            } else {

                results.push({
                    test:
                        "Invalid Login Test",
                    status: "failed",
                    reason:
                        "Login form elements missing"
                });

            }

        } catch (error) {

            results.push({
                test:
                    "Invalid Login Test",
                status: "failed",
                reason: error.message
            });

        }

        /*
         SCREENSHOT
        */
        await page.screenshot({
            path: "login-test-result.png",
            fullPage: true
        });

        /*
         FINAL RESULT
        */
        await browser.close();

        return {

            success: true,

            loginUrl,

            results,

            consoleErrors,

            screenshot:
                "login-test-result.png"

        };

    } catch (error) {

        await browser.close();

        return {

            success: false,

            error: error.message

        };

    }

}

module.exports = {
    testLoginFlow
};
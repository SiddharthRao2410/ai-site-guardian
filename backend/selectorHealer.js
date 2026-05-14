/*
 AI SELECTOR HEALER
*/
async function findWorkingSelector(
    page,
    selectorOptions
) {

    /*
     TRY EACH SELECTOR
    */
    for (
        const selector
        of selectorOptions
    ) {

        try {

            const element =
                await page.$(
                    selector
                );

            /*
             SUCCESS
            */
            if (element) {

                console.log(
                    "Working selector found:"
                );

                console.log(
                    selector
                );

                return selector;

            }

        } catch (error) {

            console.log(
                "Selector failed:"
            );

            console.log(
                selector
            );

        }

    }

    /*
     NO SELECTOR FOUND
    */
    return null;

}

/*
 GENERATE FALLBACK SELECTORS
*/
function generateSelectorOptions(
    buttonText
) {

    return [

        /*
         TEXT SELECTOR
        */
        `text=${buttonText}`,

        /*
         ROLE SELECTOR
        */
        `button:has-text("${buttonText}")`,

        /*
         ARIA LABEL
        */
        `[aria-label*="${buttonText}"]`,

        /*
         INPUT BUTTON
        */
        `input[value*="${buttonText}"]`,

        /*
         GENERIC BUTTON
        */
        `button`

    ];

}

module.exports = {

    findWorkingSelector,

    generateSelectorOptions

};
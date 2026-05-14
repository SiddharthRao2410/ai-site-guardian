/*
 REGRESSION ANALYZER
*/
function analyzeRegression(
    previousReport,
    currentReport
) {

    /*
     RESULTS
    */
    const regressions = [];

    /*
     PERFORMANCE REGRESSION
    */
    const previousPerformance =
        previousReport
            ?.performanceResults || [];

    const currentPerformance =
        currentReport
            ?.performanceResults || [];

    /*
     COMPARE LOAD TIMES
    */
    currentPerformance.forEach(
        currentPage => {

            const previousPage =
                previousPerformance.find(
                    page =>
                        page.page ===
                        currentPage.page
                );

            /*
             PAGE EXISTS
            */
            if (previousPage) {

                /*
                 LOAD TIME REGRESSION
                */
                if (
                    currentPage.loadTime >
                    previousPage.loadTime + 2000
                ) {

                    regressions.push({

                        type:
                            "performance-regression",

                        page:
                            currentPage.page,

                        previousLoadTime:
                            previousPage.loadTime,

                        currentLoadTime:
                            currentPage.loadTime,

                        severity:
                            "medium"

                    });

                }

            }

        }
    );

    /*
     ACCESSIBILITY REGRESSION
    */
    const previousAccessibility =
        previousReport
            ?.accessibilityResults || [];

    const currentAccessibility =
        currentReport
            ?.accessibilityResults || [];

    currentAccessibility.forEach(
        currentPage => {

            const previousPage =
                previousAccessibility.find(
                    page =>
                        page.page ===
                        currentPage.page
                );

            if (previousPage) {

                /*
                 MORE ACCESSIBILITY ISSUES
                */
                if (

                    currentPage.imagesWithoutAlt >

                    previousPage.imagesWithoutAlt

                ) {

                    regressions.push({

                        type:
                            "accessibility-regression",

                        page:
                            currentPage.page,

                        issue:
                            "More images missing alt text",

                        severity:
                            "high"

                    });

                }

            }

        }
    );

    /*
     RETURN RESULTS
    */
    return regressions;

}

module.exports = {
    analyzeRegression
};
const {
    GoogleGenerativeAI
} = require(
    "@google/generative-ai"
);

/*
 GEMINI CLIENT
*/
const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

/*
 MODEL
*/
const model =
    genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

/*
 AI BUG REPORTER
*/
async function generateBugReport(
    reportData
) {

    try {

        /*
         AI PROMPT
        */
        const prompt = `
You are a senior QA engineer.

Analyze these autonomous QA test results.

Generate:

1. Critical Issues
2. Medium Issues
3. Low Priority Issues
4. Performance Risks
5. Accessibility Risks
6. Developer Recommendations
7. Final QA Summary

Test Results:

${JSON.stringify(
            reportData,
            null,
            2
        )}

Return ONLY valid JSON.

Example:

{
  "criticalIssues": [],
  "mediumIssues": [],
  "lowIssues": [],
  "performanceRisks": [],
  "accessibilityRisks": [],
  "recommendations": [],
  "summary": ""
}
`;

        /*
         GEMINI REQUEST
        */
        const result =
            await model.generateContent(
                prompt
            );

        const response =
            await result.response;

        const text =
            response.text();

        /*
         CLEAN RESPONSE
        */
        const cleaned =
            text
                .replace(
                    /```json/g,
                    ""
                )
                .replace(
                    /```/g,
                    ""
                )
                .trim();

        /*
         PARSE JSON
        */
        return JSON.parse(
            cleaned
        );

    } catch (error) {

        console.log(
            "Bug Reporter Error:"
        );

        console.log(error);

        return {

            summary:
                "Bug report generation failed"

        };

    }

}

module.exports = {
    generateBugReport
};
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
 PLAYWRIGHT SCRIPT GENERATOR
*/
async function generatePlaywrightScripts(
    reportData
) {

    try {

        const prompt = `
You are a senior QA automation engineer.

Analyze this QA report and generate Playwright test scripts.

Generate:
1. Login test
2. Form validation test
3. Accessibility test
4. Performance smoke test

QA DATA:

${JSON.stringify(
            reportData,
            null,
            2
        )}

Return ONLY valid JSON.

Example:

{
  "loginTest": "...",
  "formValidationTest": "...",
  "accessibilityTest": "...",
  "performanceTest": "..."
}
`;

        const result =
            await model.generateContent(
                prompt
            );

        const response =
            await result.response;

        const text =
            response.text();

        /*
         CLEAN JSON
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

        return JSON.parse(
            cleaned
        );

    } catch (error) {

        console.log(
            "Script Generator Error:"
        );

        console.log(error);

        return {

            error:
                "Script generation failed"

        };

    }

}

module.exports = {
    generatePlaywrightScripts
};
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
 AI FIX SUGGESTION ENGINE
*/
async function generateFixSuggestions(
    qaResults
) {

    try {

        /*
         AI PROMPT
        */
        const prompt = `
You are a senior QA architect, accessibility expert, frontend engineer, and Playwright automation engineer.

Analyze these autonomous QA findings deeply.

For EACH issue:

Generate:

1. Issue Title
2. Root Cause
3. Why This Happens
4. Business Impact
5. User Impact
6. Recommended Fix
7. Suggested Code Fix
8. Better Playwright Strategy
9. Severity
10. Developer Guidance

IMPORTANT:
Be highly specific.

If issue relates to:
- accessibility → give HTML/React fixes
- Playwright selectors → give robust selectors
- performance → give optimization fixes
- forms → give validation fixes
- console errors → explain JS failure
- broken links → explain routing issue

Generate production-grade recommendations.

QA Findings:

${JSON.stringify(
            qaResults,
            null,
            2
        )}

Return ONLY valid JSON.

Example:

{
  "fixSuggestions": [
    {
      "title": "",
      "rootCause": "",
      "whyItHappens": "",
      "businessImpact": "",
      "userImpact": "",
      "recommendedFix": "",
      "suggestedCodeFix": "",
      "playwrightRecommendation": "",
      "severity": "",
      "developerGuidance": ""
    }
  ]
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
         RETURN JSON
        */
        return JSON.parse(
            cleaned
        );

    } catch (error) {

        console.log(
            "Fix Suggestion Error:"
        );

        console.log(error);

        return {

            fixSuggestions: []

        };

    }

}

module.exports = {
    generateFixSuggestions
};
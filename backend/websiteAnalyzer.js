const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

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
 WEBSITE ANALYZER
*/
async function analyzeWebsite(siteData) {

    try {

        /*
         REDUCE PAYLOAD SIZE
        */
        const simplifiedPages =
            siteData.pages.map(page => ({

                url: page.url,

                title: page.title,

                buttons:
                    page.buttons.map(btn => btn.text),

                forms:
                    page.forms.length,

                totalLinks:
                    page.links.length

            }));

        /*
         AI PROMPT
        */
        const prompt = `
You are an expert AI QA Engineer.

Analyze this entire website structure.

Website Data:

${JSON.stringify(simplifiedPages, null, 2)}

Your tasks:

1. Detect important flows
Examples:
- authentication
- ecommerce
- dashboard
- blog
- support

2. Detect important pages
Examples:
- login
- signup
- checkout
- cart
- admin

3. Generate intelligent QA test cases.

4. Detect possible risks or vulnerabilities.

5. Give automation recommendations.

Return ONLY valid JSON.

Example format:

{
  "websiteType": "community platform",

  "detectedFlows": [
    "authentication",
    "community"
  ],

  "importantPages": [
    {
      "url": "/login",
      "type": "login"
    }
  ],

  "testCases": [
    "Verify invalid password handling",
    "Verify signup validation"
  ],

  "risks": [
    "No captcha on login page"
  ],

  "recommendations": [
    "Add rate limiting"
  ]
}
`;

        /*
         GEMINI REQUEST
        */
        const result =
            await model.generateContent(prompt);

        const response =
            await result.response;

        const text =
            response.text();

        /*
         CLEAN GEMINI RESPONSE
        */
        const cleaned =
            text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

        /*
         PARSE JSON
        */
        return JSON.parse(cleaned);

    } catch (error) {

        console.log(
            "Website Analysis Error:"
        );

        console.log(error);

        return {
            error: "AI analysis failed"
        };

    }

}

module.exports = {
    analyzeWebsite
};
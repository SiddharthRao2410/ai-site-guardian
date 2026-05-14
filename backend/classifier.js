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
 PAGE CLASSIFIER
*/
async function classifyPage(pageData) {

    try {

        const prompt = `
You are an expert AI QA engineer.

Analyze this webpage data:

${JSON.stringify(pageData, null, 2)}

Classify the page type.

Possible page types:
- login
- signup
- ecommerce
- cart
- checkout
- dashboard
- contact
- blog
- landing-page
- unknown

Return ONLY valid JSON.

Example:
{
  "pageType": "login",
  "reason": "Contains password field and login button"
}
`;

        const result =
            await model.generateContent(prompt);

        const response =
            await result.response;

        const text =
            response.text();

        return text;

    } catch (error) {

        console.log(
            "Gemini Classification Error:"
        );

        console.log(error);

        return {
            pageType: "unknown",
            reason: "AI classification failed"
        };

    }

}

module.exports = {
    classifyPage
};
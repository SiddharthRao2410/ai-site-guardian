const {
    GoogleGenerativeAI
} = require("@google/generative-ai");

require("dotenv").config();

const genAI =
    new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY
    );

async function checkModels() {

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
        );

        const data = await response.json();

        console.log(JSON.stringify(data, null, 2));

    } catch (error) {

        console.log(error);

    }

}

checkModels();
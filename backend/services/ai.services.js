const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

async function generateAIResponse(prompt) {

    const maxRetries = 3;
    for(let attempt = 1; attempt <= maxRetries; attempt++) {
        try{
            const response = await ai.models.generateContent({
                model:"gemini-3.8-flash",
                contents:prompt
            }) 
            return response.text;
        }catch(error){
            console.log(`Gemini request failed. Attempt ${attempt}/${maxRetries}`);
            if(error.status === 503 && attempt < maxRetries){
                console.log("Retrying Gemini request..."); 
                await new Promise((resolve) => 
                    setTimeout(resolve, 2000 * attempt) 
                ); 
                continue;
            }
            throw error;
        }
    }  
}

module.exports = {generateAIResponse};
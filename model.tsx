import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
<<<<<<< HEAD
=======

// chat model for export 
>>>>>>> 96322d3 (node_modules ignore this time)
const model = async () => {
    const llm_chat = async () => {
        const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
        // model: "gemini-2.0-pro" : Google API key is required for this model
      apiKey: process.env.GOOGLE_API_KEY,
      maxOutputTokens: 2048,
    });
<<<<<<< HEAD

=======
>>>>>>> 96322d3 (node_modules ignore this time)
}

};

export default model;
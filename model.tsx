import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const model = async () => {
  
      const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
        // model: "gemini-2.0-pro" : Google API key is required for this model
      apiKey: process.env.GOOGLE_API_KEY,
      maxOutputTokens: 2048,
    });

    return model;


};

export default model;
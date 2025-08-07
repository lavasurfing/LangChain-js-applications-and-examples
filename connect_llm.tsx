<<<<<<< HEAD
=======
// Connecting to Google Gemini LLM using LangChain.js
>>>>>>> 96322d3 (node_modules ignore this time)
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import 'dotenv/config';


const llm_chat = async () => {
    const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
<<<<<<< HEAD
=======
    // model: "gemini-2.0-pro" : Google API key is required for this model
>>>>>>> 96322d3 (node_modules ignore this time)
  apiKey: process.env.GOOGLE_API_KEY,
  maxOutputTokens: 2048,
});

<<<<<<< HEAD
// Batch and stream are also supported
=======
// 
>>>>>>> 96322d3 (node_modules ignore this time)
const res = await model.invoke([
  [
    "human",
    "What would be a good company name for a company that makes colorful socks?",
  ],
]);

console.log(res);
}

llm_chat().catch(console.error);

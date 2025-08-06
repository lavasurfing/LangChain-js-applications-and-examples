import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import 'dotenv/config';


const llm_chat = async () => {
    const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  maxOutputTokens: 2048,
});

// Batch and stream are also supported
const res = await model.invoke([
  [
    "human",
    "What would be a good company name for a company that makes colorful socks?",
  ],
]);

console.log(res);
}

llm_chat().catch(console.error);

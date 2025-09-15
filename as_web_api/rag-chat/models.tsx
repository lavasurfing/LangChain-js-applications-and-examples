import path from "path";
import { configDotenv } from "dotenv";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Load env from project root
const rootEnvPath = path.resolve(__dirname, "../../", ".env");
configDotenv({ path: rootEnvPath });


console.log(rootEnvPath);

export const embeddings_LLM_google = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "RAG chat document",
});

export const chatModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  maxOutputTokens: 2048,
});



// LCEL : LangChain Expression Language 
// here we are using chat prompt template for system message 
//  prompt is forwared to a model using .pipe(<model>) which is then invoked using chain.invoke() , this how chaining works for different ai model doing same tasks
import model from "./model"
import 'dotenv/config';
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const chaining = async () => {

    
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        // model: "gemini-2.0-pro" : Google API key is required for this model
        apiKey: process.env.GOOGLE_API_KEY,
        maxOutputTokens: 2048,
    });


    const prompt = ChatPromptTemplate.fromMessages([`what are the company names for {product}`])

    const chain = prompt.pipe(model)

    console.log(await chain.invoke({
        product : 'colorful socks'
    }))




}

chaining()

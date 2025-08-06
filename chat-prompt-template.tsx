// using chat prompt template in LangChain.js
import { ChatPromptTemplate } from "@langchain/core/prompts";


const chatPrompt = async () => {
    //  here creating a template for chat where we can pass any topic 
    const prompt = ChatPromptTemplate.fromMessages([`What the best top 5 {topic} names ?`])

    //  console.log(await prompt.format({ topic: "AI" }));
     console.log(await prompt.formatMessages({ topic: "AI" }));
}


chatPrompt().catch(console.error);




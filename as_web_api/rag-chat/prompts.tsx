import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesPlaceholder } from "@langchain/core/prompts";

  const answerGenerationPrompt_builder = async () => {

    const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher,
        expert at interpreting and answering questions based on provided sources.
        Using the below provided context and chat history, 
        answer the user's question to the best of your ability
        using only the resources provided. Be verbose!

        <context>
        {context}
        </context>`;

    const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
      ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
      new MessagesPlaceholder("history"),
      [
        "human",
        `Now, answer this question using the previous context and chat history:
      
        {standalone_question}`
      ]
    ]);

    return answerGenerationChainPrompt

  }

  export default answerGenerationPrompt_builder;
  













  


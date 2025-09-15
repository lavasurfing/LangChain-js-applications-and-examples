import { RephraseQuestionChain } from "../../coversational_chat/converstion_export";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { document_retreival_chain } from "./document_retreival_chain";
import { chatModel } from "./models";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

  const answerGenerationPrompt_builder = async () => {
    const rephraseQuestionChain = await RephraseQuestionChain();

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
  













  


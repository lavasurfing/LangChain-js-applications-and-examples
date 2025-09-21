import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { chatModel } from "./models";
import answerGenerationPrompt_builder from "./prompts";
import { httpResponseOutputParser } from "./output";
import { getHistoryForSession } from "./memory";
import { RephraseQuestionChain } from "../../coversational_chat/converstion_export";
import { document_retreival_chain } from "./document_retreival_chain";


import { TextDecoder } from "util";




export async function buildConversationalRagChain() {

  const rephraseQuestionChain = await RephraseQuestionChain();

  const answerGenerationChainPrompt = await answerGenerationPrompt_builder();

  const conversationalRetrievalChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      standalone_question: rephraseQuestionChain,
    }),
    RunnablePassthrough.assign({
      context: await document_retreival_chain(),
    }),
    answerGenerationChainPrompt,
    chatModel,
  ]);


  const finalRetrievalChain = new RunnableWithMessageHistory({
    runnable: conversationalRetrievalChain,
    getMessageHistory: getHistoryForSession,
    inputMessagesKey: "question",
    historyMessagesKey: "history"
  }).pipe(httpResponseOutputParser);


  return finalRetrievalChain;

}

const testing = async () => {
  const chain = await buildConversationalRagChain();
  const response = await chain.invoke(
    { question: "What are mathematical parts of this course?" },
    { configurable: { sessionId: "default" } }
  );
  
  console.log("response>:");
  console.log(response);

 }


testing();









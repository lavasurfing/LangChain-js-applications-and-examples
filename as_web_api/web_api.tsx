import path from "path";
import { configDotenv } from "dotenv";

import { split_document, load_document, convertDocsToString } from "../question-answer/ques-ans";
import { RunnableSequence } from "@langchain/core/runnables";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

import { CreateDocumentRetrievalChain, RephraseQuestionChain } from "../coversational_chat/converstion_export";

import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { Runnable, RunnablePassthrough } from "@langchain/core/runnables";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HttpResponseOutputParser } from "langchain/output_parsers"

import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

import express from "express";
import cors from "cors";

import dotevn from "dotenv";





const rootpath = path.resolve(__dirname, '../', '.env');

configDotenv({ path: rootpath });

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  apiKey: process.env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

const AImodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  maxOutputTokens: 2048,
});

export const web_api_llm = async () => {

  const thepdf = await load_document();
  const the_retriever = await split_document(1000, 200, embeddings, thepdf);

  const documentRetrievalChain = await CreateDocumentRetrievalChain();
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

    const conversationalRetrievalChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        standalone_question: rephraseQuestionChain,
      }),
      RunnablePassthrough.assign({
        context : documentRetrievalChain
      }),
      answerGenerationChainPrompt,
      AImodel
      ]);
    
      // HTTP output parser
      const httpResponseOutputParser = new HttpResponseOutputParser({
        contentType: "text/plain",
      });

      const messageHistory = new ChatMessageHistory();


      // ------------------------------------------------------------------------------------------------------------------------------
      // Final Chain - without new message history for every session

      // const finalRetrievalChain = new RunnableWithMessageHistory({
      //   runnable: conversationalRetrievalChain,
      //   getMessageHistory: (_sessionId) => messageHistory,
      //   historyMessagesKey : "history",
      //   inputMessagesKey: "question"
      // }).pipe(httpResponseOutputParser);
      // ------------------------------------------------------------------------------------------------------------------------------


      const messageHistories = {}

      //  If session id exist then return it , else create new session id 
      const getMessageHistoryForSession = (sessionId: string) => {
        if (messageHistories[sessionId]!== undefined){
          return messageHistories[sessionId];
        }
        const newChatSessionHistory = new ChatMessageHistory();
        messageHistories[sessionId] = newChatSessionHistory;
        return newChatSessionHistory;
      }

      const finalRetrievalChain = new RunnableWithMessageHistory({
        runnable: conversationalRetrievalChain,
        getMessageHistory: getMessageHistoryForSession,
        inputMessagesKey: "question",
        historyMessagesKey: "history"
      }).pipe(httpResponseOutputParser);

      const port = 8087

      const handler = async (request: Request): Promise<Response> => {
        const body = await request.json();
        try{
          const stream = await finalRetrievalChain.stream(
          {
            question: body.question
          },
          { 
            configurable: {sessionId: body.sessionId}
          }
        );
        return new Response(stream, {
            status: 200,
            headers: {
              "Content-Type": "text/plain"
            },
          })
        }
        catch (e){
          console.error("Error occurred while processing request:", e);
          return new Response("Internal Server Error", { status: 500 });
        }

      }

      // start express server using handler as callback
      const app = express();
      app.use(cors());
      app.use(express.json());

      app.post("/chat", async (req, res) => {
        try {
          const request = new Request(`http://localhost:${port}/chat`, {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(req.body)
          });

          const response = await handler(request);
          res.status(response.status);
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          const text = await response.text();
          res.send(text);
        } catch (error) {
          console.error("/chat route error:", error);
          res.status(500).send("Internal Server Error");
        }
      });

      app.get("/health", (_req, res) => {
        res.status(200).send("ok");
      });

      app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
      });



    }


    web_api_llm();













     
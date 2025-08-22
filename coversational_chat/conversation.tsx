import { load_document } from "../question-answer/ques-ans";
import { split_document, convertDocsToString } from "../question-answer/ques-ans";

import "dotenv/config";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { TaskType } from "@google/generative-ai";

import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import { configDotenv } from "dotenv";
import path from "path";

import { RunnablePassthrough } from "@langchain/core/runnables";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";



const rootpath = path.resolve(__dirname, '../', '.env');
configDotenv({ path: rootpath });


// ai embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  apiKey: process.env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});


// main functions
const Conversational_chat = async () => {
    const thepdf = await load_document();
    const the_retriever = await split_document(1000, 200, embeddings, thepdf);


    // Runnable sequence
    const documentRetrievalChain = RunnableSequence.from([
        (input) => input.question,
        the_retriever,
        convertDocsToString
    ])

        // Let's build the retreival chain

    const TEMPLATE_STRING = `You are an experienced researcher, 
        expert at interpreting and answering questions based on provided sources.
        Using the provided context, answer the user's question 
        to the best of your ability using only the resources provided. 
        Be verbose!

        <context>

        {context}

        </context>

        Now, answer this question using the above context:

        {question}`

        const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(TEMPLATE_STRING);

        // ai model declaration

    const model = new ChatGoogleGenerativeAI({
                model: "gemini-2.0-flash",
                // model: "gemini-2.0-pro" : Google API key is required for this model
                apiKey: process.env.GOOGLE_API_KEY,
                maxOutputTokens: 2048,
                });
    
    const retreivalChain = RunnableSequence.from([
        {
            context: documentRetrievalChain,
            question: (input) => input.question
        },
        answerGenerationPrompt,
        model,
        new StringOutputParser()
    ]);

    // --------------------------------------------------------------------------------------------------------------------
    //  Output so far 

    // retreivalChain.invoke({
    //     question: "What are the prerequisties for this course ?"
    // }).then((res) => console.log(res)); 

    // --------------------------------------------------------------------------------------------------------------------

    const RPHRASE_QUESTION_SYSTEM_TEMPLATE  = 
    `Given the following conversation and a follow up question, 
    rephrase the follow up question to be a standalone question.`

    const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
        ["system", RPHRASE_QUESTION_SYSTEM_TEMPLATE],
        new MessagesPlaceholder("history"),
        [
            "human",
            "Rephrase the following question as a standalone question:\n{question}"
        ]
    ])

    const repharseQuestionChain = RunnableSequence.from([
        rephraseQuestionChainPrompt,
        new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            apiKey: process.env.GOOGLE_API_KEY,
            maxOutputTokens: 2048,
        }),
        new StringOutputParser()
    ]);

    const chatHistory = [
        new HumanMessage("What are the prerequisties for this course ?"),
        new AIMessage("The prerequisites for this course are: ...")
    ]


    // --------------------------------------------------------------------------------------------------------------------
    // Check out put for rephrasing the question chain 

    // await repharseQuestionChain.invoke({
    //     question: "Can you list them in bullet point form ?",
    //     history: chatHistory
    // }).then((res) => console.log(res));

    // --------------------------------------------------------------------------------------------------------------------


    // Putting it all together to gather the context, question, history and answer
    const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher, 
            expert at interpreting and answering questions based on provided sources.
            Using the below provided context and chat history, 
            answer the user's question to the best of 
            your ability 
            using only the resources provided. Be verbose!

            <context>
            {context}
            </context>`
    
    const answerGenerationPromptFinal = ChatPromptTemplate.fromMessages([
        ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
        new MessagesPlaceholder("history"),
        [
            "human",
            "Now, answer this question using the above context and chat history:\n{standalone_question}"
        ]
    ]);


// --------------------------------------------------------------------------------------------------------------------
    // Check output of the final answer generatiion prompt

    // await answerGenerationPromptFinal.formatMessages({
    //     context : "fake retrieved content",
    //     standalone_question : "Why is the sky blue ?",
    //     history : [
    //         new HumanMessage("How are you ?"),
    //         new AIMessage("Fine, thank you !")
    //     ]
    // }).then((res) => console.log(res));
// --------------------------------------------------------------------------------------------------------------------

    const conversationalRerievalChain = RunnableSequence.from([
        RunnablePassthrough.assign(
        {
            standalone_question: repharseQuestionChain,
        }
        ),
        RunnablePassthrough.assign({
            context: documentRetrievalChain
        }),
        answerGenerationPromptFinal,
        model,
        new StringOutputParser()
    ]);

    const messageHistory = new ChatMessageHistory();

    const finalRetrievalChain = new RunnableWithMessageHistory({
        runnable : conversationalRerievalChain,
        getMessageHistory:  (_sessionId) => messageHistory,
        historyMessagesKey : "history",
        inputMessagesKey: "question"
    });

    const originalQuestion = 'What are the prerequisites for this course?';

    const originalAnswer = await finalRetrievalChain.invoke(
        {
        question: originalQuestion
        },
        {
            configurable : {sessionId: "test"}
        },
    )

    const finalResult = await finalRetrievalChain.invoke(
        {
        question : "Can you list them in bullet point form?"
        },
        {
            configurable: { sessionId: "test" }

        }
    );

    console.log(finalResult);





}



// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// RUNNERS 

// Part - 1 : 
Conversational_chat()





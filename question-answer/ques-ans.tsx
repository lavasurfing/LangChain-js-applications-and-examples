import 'dotenv/config' 
import path from 'path'
import { configDotenv } from 'dotenv'

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'

import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { RunnableSequence } from '@langchain/core/runnables'

import { Document } from 'langchain/document'
import { ChatPromptTemplate } from '@langchain/core/prompts'

import { RunnableMap } from '@langchain/core/runnables'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { StringOutputParser } from '@langchain/core/output_parsers'



// configuring .env file for API Keys
const rootpath = path.resolve(__dirname, '../','.env')
configDotenv({path: rootpath});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  apiKey: process.env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});
 
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// document loading : from the path
const load_document = async () => {
    const pdf_path = path.resolve(__dirname,'../','thebook.pdf')

    const loader = new PDFLoader(pdf_path)

    const thebookPDF  = await loader.load()

    return thebookPDF
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// splitting into chunks
const split_document = async (chunkSize: number, chunkOverlap: number, pdf: any) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: chunkSize,
        chunkOverlap: chunkOverlap
    })

    const split_doc = await splitter.splitDocuments(pdf)

    // feeding them into vector 

    const vectorStore = new MemoryVectorStore(embeddings)

    // adding docs to vector store
    await vectorStore.addDocuments(split_doc)

    const retriever = vectorStore.asRetriever()

    return retriever

}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// runners 

// start a runnable sequence 



// this function help to stringfy the doucument and it's page content
const convertDocsToString = (documents: Document[] ) => {
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n")
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------



const runner = async () => {
    const thebook = await load_document()
    const retriever = await split_document(1536, 128, thebook)

    // Runnable sequence
    const documentRetrievalChain = RunnableSequence.from([
        (input) => input.question,
        retriever,
        convertDocsToString
    ])


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    // Checking if above runnable producing results

    // const results = await documentRetrievalChain.invoke({
    //     question: "What are the prerequisites for this course?"
    // })
    // console.log(results)



    // --------------------------------------------------------------------------------------------------------------

    // synthesing response

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

    const runnableMap = RunnableMap.from({
        context: documentRetrievalChain,
        question : (input: any) => input.question,
    });



    // running using runnable map

    // await runnableMap.invoke({
    //     question: "What are the prerequisties for this course? "
    // }).then((res) => console.log(res))


    // ----------------------------------------------------------------------------------------------------------------------------------------
    // Augmented generation 

    // model declaration
    const model = new ChatGoogleGenerativeAI({
          model: "gemini-2.0-flash",
            // model: "gemini-2.0-pro" : Google API key is required for this model
          apiKey: process.env.GOOGLE_API_KEY,
          maxOutputTokens: 2048,
        });

    
    const retrievalChain = RunnableSequence.from([
        {
            context: documentRetrievalChain,
            question: (input) => input.question
        },
        answerGenerationPrompt,
        model,
        new StringOutputParser()
    ])

    // First question answer
    const answer = await retrievalChain.invoke({
        question : "What are the prerequisties for this course ?"
    })

    console.log(answer)

    // follow up question
    const followupAnswer = await retrievalChain.invoke({
        question: "Can you list them in bullet point form ?"
    })

    console.log("Follow up "  +followupAnswer)

    const docs = await documentRetrievalChain.invoke({
        question: "Can you list them in bullet point form ?"
    });

    console.log("DOCS "+ docs)

}


// function runner
runner()


// parseOutput

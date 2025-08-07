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
import { load } from 'langchain/load'



// configuring .env file for API Keys
const rootpath = path.resolve(__dirname, '../','.env')
configDotenv({path: rootpath});

// embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  apiKey: process.env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});
 

// document loading 
const load_document = async () => {
    const pdf_path = path.resolve(__dirname,'../','thebook.pdf')

    const loader = new PDFLoader(pdf_path)

    const thebookPDF  = await loader.load()

    return thebookPDF
}
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

// runners 

// start a runnable sequence 



// this function help to stringfy the doucument and it's page content
const convertDocsToString = (documents: Document[] ) => {
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n")
}



const runner = async () => {
    const thebook = await load_document()
    const retriever = await split_document(1536, 128, thebook)

    const documentRetrievalChain = RunnableSequence.from([
        (input) => input.question,
        retriever,
        convertDocsToString
    ])

    const results = await documentRetrievalChain.invoke({
        question: "What are the prerequisites for this course?"
    })

    console.log(results)


}

runner()


// parseOutput

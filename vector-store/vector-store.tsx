import 'dotenv/config'

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

import { similarity } from 'ml-distance'

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import path from 'path';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { configDotenv } from 'dotenv';

require('@dotenvx/dotenvx').config()


// env varible management 
  const rootpath = path.resolve(__dirname, '../','.env')
  configDotenv({path: rootpath});



const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  apiKey: process.env.GOOGLE_API_KEY,
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});


//  Print text data as vectors
const vector_store = async () => {

    await embeddings.embedQuery("Hello World").then((data) => console.log(data))

}

// similarity between two vectors
const check_similaity = async () => {
    const vector1 = await embeddings.embedQuery('Why are vectors useful for in machine learning ?');

    const unrealtedVector = await embeddings.embedQuery('A group of parrots is called a pademonium')

    const similarVector = await embeddings.embedQuery('Vectors are representaion of infomation')

    console.log(similarity.cosine(vector1, similarVector))
}

// ---------------------------------------------------------------------------------------------

// pdf reading to vector store
const pdf_reading_toVector = async () => {

  // Directory of the pdf file
  const pdf_path = path.resolve(__dirname, '../', 'thebook.pdf')
  // console.log(pdf_path)

  // loading pdf into pdfloader
  const loader = new PDFLoader(pdf_path)

  // pdf loaded into varibes
  const thebookPDF = await loader.load()

  // console.log(thebookPDF.slice(0, 5))

  // initalizing splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 128,
    chunkOverlap: 0
  })

  // using spliter to split documents for vector store
  const split_doc = await splitter.splitDocuments(thebookPDF)
  
  // initialzing vector store
  const vectorStore = new MemoryVectorStore(embeddings)

  // adding document to vector store
  await vectorStore.addDocuments(split_doc)

  // retrieving info using similarity search on the basic of query 
  const retrivedDocs = await vectorStore.similaritySearch(
    "What is machine learning?",
    4
  )

  // docs retrieved
  const pageContents = retrivedDocs.map(doc => doc.pageContent)

  // console.log(pageContents)

  // using vector store as retriever of data
  const retriever = vectorStore.asRetriever()

  await retriever.invoke("what is the toughest topic in machine learning").then((res) => console.log(res))

  // Augmentated Generation 

  // model decralation
  import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
  const model = async () => {
      const llm_chat = async () => {
          const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
          // model: "gemini-2.0-pro" : Google API key is required for this model
        apiKey: process.env.GOOGLE_API_KEY,
        maxOutputTokens: 2048,
      });
  }


}

// run

// vector_store()

// check_similaity()

pdf_reading_toVector()




import loader from "./loader";
import { embeddings_LLM_google } from "./models";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const retriever = async () => {
  const thepdf = await loader();
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const split_doc = await splitter.splitDocuments(thepdf);

  const vectorstore = new MemoryVectorStore(embeddings_LLM_google);

  await vectorstore.addDocuments(split_doc);

  const retriever = vectorstore.asRetriever();

  return retriever

}

export default retriever;
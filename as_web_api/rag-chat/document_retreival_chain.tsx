import loader from "./loader";
import retriever from "./retriever";
import { RunnableSequence} from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

const convertDocsToString = (documents: Document[] ) => {
    return documents.map((document) => {
        return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n")
}

export const document_retreival_chain = async () => {
    const retriever_instance = await retriever();

    const doc_chain = RunnableSequence.from([
        (input) => input.question,
        retriever_instance,
        convertDocsToString
    ])

    return doc_chain

}
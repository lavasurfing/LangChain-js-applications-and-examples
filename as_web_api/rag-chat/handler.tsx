//  handler function for the RAG chat API - 07a
import { request } from "http";
import { buildConversationalRagChain } from "./chain";


const handler = async (request: any) => {
    const body = await request.json();
    const finalRetrievalChain = await buildConversationalRagChain();
    const stream = await finalRetrievalChain.stream({
        question: body.question

    }, { configurable: { sessionId: body.sessionId || "default" } });
    
    return new Response(stream, {
        status: 200,
        headers: { "Content-Type": "text/plain" }
    })
  }



export default handler;
import express from "express";
import cors from "cors";
import { buildConversationalRagChain } from "./chain";

export async function createServer(port: number = 8090) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const chain = await buildConversationalRagChain();

  app.get("/health", (_req, res) => {
    res.status(200).send("ok");
  });

  app.post("/chat", async (req, res) => {
    try {
      const { question, sessionId } = req.body || {};
      const response = await chain.stream(
        { question },
        { configurable: { sessionId: sessionId ?? "default" } }
      );
      
      let fullResponse = "";
      for await (const chunk of response) {
        const text = typeof chunk === "string" ? chunk : String(chunk);
        fullResponse += text;
      }
      
      res.status(200).json({ answer: fullResponse });
    } catch (e) {
      console.error("RAG /chat error:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return new Promise<express.Express>((resolve) => {
    app.listen(port, () => {
      console.log(`RAG server listening on http://localhost:${port}`);
      resolve(app);
    });
  });
}




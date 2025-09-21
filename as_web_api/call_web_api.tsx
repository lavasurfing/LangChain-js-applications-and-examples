import { web_api_llm } from "./web_api";

const PORT = 8087;
const BASE_URL = `http://localhost:${PORT}`;

async function isServerHealthy(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForHealthcheck(maxWaitMs: number = 5000, intervalMs: number = 200): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (await isServerHealthy()) return;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Server did not become healthy in time");
}

export async function ensureServerStarted(): Promise<void> {
  if (await isServerHealthy()) return;
  await web_api_llm();
  await waitForHealthcheck();
}

export async function chatWithServer(question: string, sessionId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, sessionId })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat request failed: ${res.status} ${text}`);
  }
  return await res.text();
}

export async function startAndChat(question: string, sessionId: string): Promise<string> {
  await ensureServerStarted();
  return await chatWithServer(question, sessionId);
}

// Example usage (uncomment to run directly):
(async () => {
  await ensureServerStarted();
  const answer = await chatWithServer("Hello", "demo-1");
  console.log(answer);
})();

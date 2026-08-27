import { createServer, type IncomingMessage } from "node:http";
import { handleRequest } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

async function parseBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const body = await parseBody(request);
    const result = handleRequest(request.method ?? "GET", url.pathname, body);

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    response.writeHead(result.status, { "Content-Type": "application/json" });
    response.end(result.body === undefined ? undefined : JSON.stringify(result.body));
  } catch {
    response.writeHead(400, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ message: "Invalid request" }));
  }
});

server.listen(port, () => {
  console.log(`album-api-v2 listening on http://localhost:${port}`);
});

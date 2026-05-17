import { Hono } from "hono";
import { createProvider } from "./utils/provider";

const app = new Hono();

app.post("/v1/chat/completions", async (c) => {
  const { model, messages, system, prompt, provider, apiKey, baseUrl } =
    await c.req.json();

  try {
    const _provider = createProvider({ provider, apiKey, baseURL: baseUrl });

    const response = await _provider.chat({ model, messages, system, prompt });

    return c.json(response);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post("/v1/stream/completions", async (c) => {
  const { model, messages, system, prompt, provider, apiKey, baseUrl } =
    await c.req.json();
  try {
    const _provider = createProvider({ provider, apiKey, baseURL: baseUrl });
    const stream = await _provider.stream({ model, messages, system, prompt });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;

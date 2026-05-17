import { Hono } from "hono";
import { Bindings, Variables } from "../types";
import { userAuth } from "../middleware/auth";

const chat = new Hono<{ Bindings: Bindings; Variables: Variables }>();

chat.use("/*", userAuth);

function pickKey(keys: string | undefined, userId: string): string {
  if (!keys) {
    throw new Error("Missing API keys env variable");
  }

  const list = keys
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  if (list.length === 0) {
    throw new Error("No API keys configured");
  }

  const index = userId.charCodeAt(0) % list.length;
  return list[index];
}

chat.post("/", async (c) => {
  try {
    const user_id = c.get("user_id");

    const plan = (await c.env.milo_db
      .prepare("SELECT plan FROM plans WHERE user_id = ?")
      .bind(user_id)
      .first()) as { plan: string } | null;

    const isPro = plan?.plan === "pro";

    const upstream = isPro
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.groq.com/openai/v1/chat/completions";

    const apiKey = isPro
      ? pickKey(c.env.OPENROUTER_API_KEYS, user_id)
      : pickKey(c.env.GROQ_API_KEYS, user_id);

    const body = await c.req.text();

    const response = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      return c.json({ error }, response.status as any);
    }

    await c.env.milo_db
      .prepare(
        `
      INSERT INTO usage (id, user_id, date, request_count)
      VALUES (?, ?, date('now'), 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET request_count = request_count + 1
    `,
      )
      .bind(crypto.randomUUID(), user_id)
      .run();

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    //   console.error("Error in /chat:", error);

    return c.json(
      {
        error: error instanceof Error ? error.message : "unknown error",
      },
      500,
    );
  }
});

export default chat;

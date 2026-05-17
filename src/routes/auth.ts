import { Hono } from "hono";
import { Bindings } from "../types";

const auth = new Hono<{ Bindings: Bindings }>();

auth.post("/login", async (c) => {
  const { email, name, avatar } = await c.req.json();

  if (!email) return c.json({ error: "email required" }, 400);

  let user = await c.env.milo_db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (!user) {
    const id = crypto.randomUUID();
    await c.env.milo_db
      .prepare(
        "INSERT INTO users (id, email, name, avatar) VALUES (?, ?, ?, ?)",
      )
      .bind(id, email, name ?? null, avatar ?? null)
      .run();

    await c.env.milo_db
      .prepare("INSERT INTO plans (user_id, plan) VALUES (?, 'free')")
      .bind(id)
      .run();

    user = await c.env.milo_db
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(id)
      .first();
  } else {
    await c.env.milo_db
      .prepare("UPDATE users SET last_seen = datetime('now') WHERE id = ?")
      .bind((user as any).id)
      .run();
  }

  const token = crypto.randomUUID() + "-" + crypto.randomUUID();
  const expires_at = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  await c.env.milo_db
    .prepare(
      "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
    )
    .bind(token, (user as any).id, expires_at)
    .run();

  return c.json({ token, expires_at, user });
});

auth.post("/logout", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return c.json({ error: "unauthorized" }, 401);

  await c.env.milo_db
    .prepare("DELETE FROM sessions WHERE token = ?")
    .bind(token)
    .run();

  return c.json({ success: true });
});

export default auth;

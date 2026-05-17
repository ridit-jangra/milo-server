import { createMiddleware } from "hono/factory";
import { Bindings, Variables } from "../types";

export const userAuth = createMiddleware<{
  Bindings: Bindings;
  Variables: Variables;
}>(async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return c.json({ error: "unauthorized" }, 401);

  const session = (await c.env.milo_db
    .prepare("SELECT * FROM sessions WHERE token = ?")
    .bind(token)
    .first()) as { user_id: string; expires_at: string } | null;

  if (!session) return c.json({ error: "invalid token" }, 401);
  if (new Date(session.expires_at) < new Date())
    return c.json({ error: "token expired" }, 401);

  await c.env.milo_db
    .prepare("UPDATE users SET last_seen = datetime('now') WHERE id = ?")
    .bind(session.user_id)
    .run();

  c.set("user_id", session.user_id);
  await next();
});

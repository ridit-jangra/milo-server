import { Hono } from "hono";
import { Bindings, Variables } from "../types";
import { userAuth } from "../middleware/auth";

const me = new Hono<{ Bindings: Bindings; Variables: Variables }>();

me.use("/*", userAuth);

me.get("/", async (c) => {
  const user_id = c.get("user_id");
  const user = await c.env.milo_db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(user_id)
    .first();
  return c.json(user);
});

export default me;

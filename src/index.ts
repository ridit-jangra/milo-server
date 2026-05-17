import { Hono } from "hono";
import auth from "./routes/auth";
import me from "./routes/me";
import chat from "./routes/chat";
import { Bindings, Variables } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get("/", (c) => c.json({ status: "ok", name: "whisker" }));

app.route("/auth", auth);
app.route("/me", me);
app.route("/chat", chat);

export default app;

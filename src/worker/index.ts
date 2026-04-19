import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

app.get("/api/", (c) => c.json({ name: "Freelance IT Engineer", status: "online" }));

app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    console.log(`Contact form submission from ${name} (${email}): ${message}`);

    return c.json({ success: true, message: "Message received successfully" });
  } catch {
    return c.json({ success: false, error: "Invalid request body" }, 400);
  }
});

export default app;
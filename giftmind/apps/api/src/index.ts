import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { pathToFileURL } from "node:url";
import { adminRoute } from "./routes/admin";
import { authRoute } from "./routes/auth";
import { chatRoute } from "./routes/chat";
import { categoriesRoute, productRoute } from "./routes/products";
import { orderRoute } from "./routes/orders";
import { paymentRoute } from "./routes/payments";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
  })
);

app.get("/", (c) => c.json({ name: "Luxentia API", status: "ok" }));
app.route("/api/auth", authRoute);
app.route("/api/chat", chatRoute);
app.route("/api/products", productRoute);
app.route("/api/categories", categoriesRoute);
app.route("/api/orders", orderRoute);
app.route("/api/payments", paymentRoute);
app.route("/api/admin", adminRoute);

const port = Number(process.env.PORT ?? 8787);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  serve({ fetch: app.fetch, port });
  console.log(`Luxentia API running on http://localhost:${port}`);
}

export default app;

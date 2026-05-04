import { Hono } from "hono";
import { cors } from "hono/cors";
import { adminRoute } from "./routes/admin";
import { authRoute } from "./routes/auth";
import { chatRoute } from "./routes/chat";
import { categoriesRoute, productRoute } from "./routes/products";
import { orderRoute } from "./routes/orders";
import { paymentRoute } from "./routes/payments";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [])
];

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : allowedOrigins[0]),
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

export default app;

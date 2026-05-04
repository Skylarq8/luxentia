import { config } from "dotenv";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL("../../../../.env", import.meta.url)) });

import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import app from "./app.js";

app.use("*", logger());

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port });
console.log(`Luxentia API running on http://localhost:${port}`);

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import app from "./app.js";
import "dotenv/config";

app
  .use(
    "/static/*",
    serveStatic({
      root: "./",
      rewriteRequestPath: (path) => path.replace(/^\/static\//, "/"),
    })
  )
  .use(
    "/*",
    serveStatic({
      root: "./public",
    })
  );

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

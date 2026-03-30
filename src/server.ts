import { serve } from "bun";
import { gameRoute } from "./routes/game.route";
import { ratingRoute } from "./routes/rating.route";
import { checkRateLimit } from "./utils/rateLimiter";
import { genreRoute } from "./routes/genre.route";

const rateLimit = process.env.RATE_LIMIT === "off" ? false : true;

// import other routes when finished
serve({
  port: 3000,
  async fetch(req, server) {
    const url = new URL(req.url);

    const ip = server.requestIP(req);
    if (!ip) {
      return new Response(JSON.stringify({ error: "Malformed address content" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    //Returns rate limiter responses if check fails (internal error or rate exceeded)
    const rateRes = await checkRateLimit(ip.address);
    if (rateRes && rateLimit) {
      return rateRes;
    }

      // ==========================================
      // API Documentation Routes
      // ==========================================

      // 1. Serve the raw YAML file
      if (url.pathname === "/openapi.yaml") {
          const file = Bun.file("./openapi.yaml");
          return new Response(file, {
              headers: { "Content-Type": "text/yaml" }
          });
      }

      // 2. Serve the ReDoc interactive UI
      if (url.pathname === "/docs") {
          const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Game Collection API Docs</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>body { margin: 0; padding: 0; }</style>
        </head>
        <body>
          <redoc spec-url='/openapi.yaml'></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        </body>
      </html>
      `;
          return new Response(html, {
              headers: { "Content-Type": "text/html" }
          });
      }

      // Root URL redirect / Health check
      if (url.pathname === "/") {
          return new Response(JSON.stringify({
              message: "API is running!",
              docs: "Visit http://localhost:3000/docs for documentation."
          }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
          });
      }

    // Route matching
    if (url.pathname.startsWith("/games")) {
      return gameRoute(req);
    }
    // Add other routes later
    if (url.pathname.startsWith("/ratings")) {
      return ratingRoute(req);
      }
      if (url.pathname.startsWith("/genres")) {
          return genreRoute(req);
      }

    //Fallback rotue
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log("Game Collection Server running at http://localhost:3000");

import { serve } from "bun";
import { gameRoute } from "./routes/game.route";
import { ratingRoute } from "./routes/rating.route";
import { checkRateLimit } from "./utils/rateLimiter";

const rateLimit: boolean = true;

// import other routes when finished
serve({
  port: 3000,
  async fetch(req, server) {
    const url = new URL(req.url);

    //console.log(req);
    //console.log(server.requestIP(req));
    const ip = server.requestIP(req);
    if (!ip) {
      return new Response(JSON.stringify({ error: "Malformed address details" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    //Returns rate limiter responses if check fails (internal error or rate exceeded)
    const rateRes = await checkRateLimit(ip.address);
    if (rateRes && rateLimit) {
      return rateRes;
    }

    console.log("rateRes", rateRes);
    // Route matching
    if (url.pathname.startsWith("/games")) {
      return gameRoute(req);
    }
    // Add other routes later
    if (url.pathname.startsWith("/ratings")) {
      return ratingRoute(req);
    }

    //Fallback rotue
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log("Game Collection Server running at http://localhost:3000");

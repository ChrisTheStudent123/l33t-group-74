import { serve } from "bun";
import { gameRoute } from "./routes/game.route";
import { ratingRoute } from "./routes/rating.route";
import { rateLimiter } from "./utils/rateLimiter";
import type { RateLimiterRes } from "rate-limiter-flexible";

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

    const rateRes: Response | undefined = await rateLimiter
      .consume(ip.address, 1)
      .then((rateLimitRes) => {
        return undefined;
      })
      .catch((rejRes) => {
        if (rejRes instanceof Error) {
          // Redis error here
          console.error(rejRes);
          return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        } else {
          const secs = String(Math.round(rejRes.msBeforeNext / 1000) || 1);
          const headers = {
            "Content-Type": "application/json",
            "Retry-After": secs,
            "X-RateLimit-Limit": String(rateLimiter.points),
            "X-RateLimit-Remaining": String(rejRes.remainingPoints),
            "X-RateLimit-Reset": String(Math.ceil((Date.now() + rejRes.msBeforeNext) / 1000)),
          };
          return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: headers,
          });
        }
      });

    if (rateRes) {
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

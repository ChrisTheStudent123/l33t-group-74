import { RateLimiterMemory } from "rate-limiter-flexible";

const opts = {
  // Basic
  points: 5, // Number of points
  duration: 1, // Per second(s)
};

const rateLimiter = new RateLimiterMemory(opts);


//Returns response is check fails
export async function checkRateLimit(address: string): Promise<Response | undefined> {
  return rateLimiter
    .consume(address, 1) // Points use per connection
    .then((rateLimitRes) => {
      //could potentially return headers here too
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
        return new Response(JSON.stringify({ error: `Too many requests, retry in ${secs} seconds` }), {
          status: 429,
          headers: headers,
        });
      }
    });
}
import { Redis } from "ioredis";
import { RateLimiterMemory } from "rate-limiter-flexible";

const opts = {
  // Basic
  points: 5, // Number of points
  duration: 5, // Per second(s)
};

const rateLimiter = new RateLimiterMemory(opts);

export async function checkRate(address: string): Promise<Response | null> {
  await rateLimiter
    .consume(address, 1)
    .then((rateLimitRes) => {
      //logic goes here
      console.log("Points remaining: ", rateLimitRes.remainingPoints);
      return null;
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
        //Can't consume
        //No error but rateLimiterRedis promise rejected
        const secs = String(Math.round(rejRes.msBeforeNext / 1000) || 1);
        const headers = {
          "Content-Type": "application/json",
          "Retry-After": secs,
          "X-RateLimit-Limit": String(opts.points),
          "X-RateLimit-Remaining": String(rejRes.remainingPoints),
          "X-RateLimit-Reset": String(Math.ceil((Date.now() + rejRes.msBeforeNext) / 1000)),
        };
        console.log("Rate limited");
        return new Response(
          JSON.stringify({ error: `Too many requests, retry after ${secs} seconds` }),
          {
            status: 429,
            headers: headers,
          },
        );
      }
    });
}

/*
function checkRate(remoteAddress: string): Response | null {
  rateLimiter
    .consume(remoteAddress, 1)
    .then((rateLimiteRes) => {
      //logic goes here
      console.log("Points remaining: ", rateLimiter.points)
    })
    .catch((rejRes) => {
      if (rejRes instanceof Error) {
        console.error(rejRes);
        // Redis error here
      } else {
        //Can't consume
        //No error but rateLimiterRedis promise rejected
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        //return `Too many Requests, retry after ${String(secs)}`;
        console.log("Rate limited");
        return new Response(
          JSON.stringify({ error: `Too many Requests, retry after ${String(secs)}` }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    });
    console.log()
  return null;
}

*/

//waste of time...

/*
let n: number = 0;
console.log("n", n++);

const db = new Database("rateLimiter.sqlite");
const opts = {
  storeClient: db,
  tableName: "rate_limiter_flexible",
  points: 5, // Number of points
  duration: 1, // Per second(s)

  //specific
  storeType: "better-sqlite3",
};

console.log("prepare", typeof db.prepare);
console.log("db.run", typeof db.run);

console.log("n", n++);
const rateLimiter = new RateLimiterSQLite(opts);
function checkRate(address: string): Response | null {
  rateLimiter
    .consume(address)
    .then((rateLimiterRes) => {
      //1 points consume for action
    })
    .catch((rej) => {
      //No more points to consume
      return new Response(JSON.stringify({ error: "Too many Requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    });
  return null;
}

console.log("n", n++);
*/

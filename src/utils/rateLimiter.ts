//const sqlite3 = require("sqlite3").verbose();
import { Database } from "bun:sqlite";
//import Database from "better-sqlite3"
import { RateLimiterSQLite } from "rate-limiter-flexible";

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
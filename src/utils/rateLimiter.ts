import { RateLimiterMemory } from "rate-limiter-flexible";

const opts = {
  // Basic
  points: 5, // Number of points
  duration: 1, // Per second(s)
};


export const rateLimiter = new RateLimiterMemory(opts);

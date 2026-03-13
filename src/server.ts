import { serve } from "bun";

//console.log("Hello via Bun!");
serve({
  port: 3000,
  fetch(req) {
  console.log("Hello via Bun!");
  return Response.json({ ok: true, ts: Date.now() });
  },
});

console.log("http://localhost:3000");

import { serve } from "bun";
import { gameRoute } from "./routes/game.route";
import { ratingRoute } from "./routes/rating.route";
// import other routes when finished

serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

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

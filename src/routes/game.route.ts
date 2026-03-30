import { GameController } from "../controllers/game.controller";


export async function gameRoute(req: Request) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

// Routes for /games
	if (pathname === "/games") {
		if (method === "GET") {
		// GET /games
		// GET /games?q=search&year=2022&cmp=gt&order=asc
			return GameController.getAll(req);
		}
		if (method === "POST") {
		// POST /games
			return GameController.create(req);
		}
	}

// Routes for /games/:id
	const gameIdMatch = pathname.match(/^\/games\/(\d+)$/);
	if (gameIdMatch) {
		const id = Number(gameIdMatch[1]);
		if (method === "GET") {
		// GET /games/5
			return GameController.getById(req, id);
		}
		if (method === "PUT") {
		// PUT /games/5
			return GameController.update(req, id);
		}
		if (method === "DELETE") {
		// DELETE /games/5
			return GameController.delete(req, id);
		}
	}

// Fallback rotue
	return new Response("Not found", { status: 404 });
}

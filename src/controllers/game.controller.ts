import { GameModel } from "../models/game.model";

export const GameController = {

//GET /games?year=2022&cmp=gt&order=asc&page=1&limit=10&sort=title
	async getAll(req: Request) {
		try {
		const url = new URL(req.url);
		const search = url.searchParams.get("q") || undefined;
		const yearParam = url.searchParams.get("year");
		const year = yearParam ? Number(yearParam) : undefined;
		  
		if (yearParam && isNaN(year)) {
			return new Response(JSON.stringify({ error: "Invalid year parameter" }), { 
				status: 422, headers: { "Content-Type": "application/json" } 
			});
		}

		const comparator = url.searchParams.get("cmp") as "gt" | "lt" | undefined;
		if (comparator && comparator !== "gt" && comparator !== "lt") {
			return new Response(JSON.stringify({ error: "Comparator must be 'gt' or 'lt'" }), { 
				status: 400, headers: { "Content-Type": "application/json" }
			});
		}

		const validColumns = [
			  "title",
			  "release_year",
			  "developer",
			  "company",
			  "system",
			  "genre",
			  "rating"
		];

		const sortParam = url.searchParams.get("sort");
		let sortColumn: string;

		if (sortParam && validColumns.includes(sortParam)) {
		  sortColumn = sortParam; 
		} else if (search || yearParam || comparator) {
		  sortColumn = "release_year"; // falls back to release year for search or year filter unless specified
		} else {
		  sortColumn = "g.id"; // default
		}

		const order = (url.searchParams.get("order") || "asc").toLowerCase() as "asc" | "desc";

		const pageParam = url.searchParams.get("page");
		const page = pageParam ? Number(pageParam) : undefined;

		const limitParam = url.searchParams.get("limit");
		const limit = limitParam ? Number(limitParam) : undefined;

		const games = GameModel.getAll({ search, year, comparator, page, limit, sort: sortColumn, order });
        return new Response(JSON.stringify(games), { 
			status: 200, headers: { "Content-Type": "application/json" }
		});

    } catch (error: any) {
		console.error("Failed to fetch games:", error);
		return new Response(JSON.stringify({ error: "Failed to fetch games", details: error.message }), {
			status: 500, headers: { "Content-Type": "application/json" }
        });
    }
  },

// GET /games/:id
	async getById(req: Request, id: number) {
		try {
			if (!id || isNaN(id)) {
				return new Response(JSON.stringify({ error: "Invalid game ID" }), { 
					status: 400, headers: { "Content-Type": "application/json" } 
				});
			}

			const game = GameModel.getById(id);
			if (!game) {
				return new Response(JSON.stringify({ error: "Game not found" }), { 
					status: 404,  headers: { "Content-Type": "application/json" }
				});
			}
			return new Response(JSON.stringify(game), {
				status: 200, headers: { "Content-Type": "application/json" }
			});
		} catch (error: any) {
			console.error("Failed to fetch game by ID:", error);
			return new Response(JSON.stringify({ error: "Failed to fetch game", details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
		}
	},

// POST /games
	async create(req: Request) {
		try {
			const body = await req.json();
			const requiredFields = ["title", "company", "system", "genre", "release_year", "developer", "rating"];
			for (const field of requiredFields) {
				if (body[field] === undefined || body[field] === null) {
					return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
						status: 422,  headers: { "Content-Type": "application/json" }
					});
				}
			}

			if (typeof body.release_year !== "number") {
				return new Response(JSON.stringify({ error: "release_year must be a number" }), { 
					status: 400, headers: { "Content-Type": "application/json" }
				});
			}
			if (typeof body.rating !== "number" || body.rating < 0 || body.rating > 10) {
				return new Response(JSON.stringify({ error: "rating must be a number between 0 and 10" }), {
					status: 400,  headers: { "Content-Type": "application/json" } 
				});
			}
			if (typeof body.title !== "string" || body.title.trim() === "") {
				return new Response(JSON.stringify({ error: "title must be a non-empty string" }), { 
					status: 400, headers: { "Content-Type": "application/json" }
				});
			}

			const id = GameModel.create(body);

			return new Response(JSON.stringify({ id }), {
				status: 201, headers: { "Content-Type": "application/json" }
			});
		} catch (error: any) {
			console.error("Failed to create game:", error);
			return new Response(JSON.stringify({ error: "Failed to create game", details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
		}
	},

// PUT /games/:id
	async update(req: Request, id: number) {
		try {	
			if (!id || isNaN(id)) {
				return new Response(JSON.stringify({ error: "Invalid game ID" }), { 
					status: 400, headers: { "Content-Type": "application/json" }
				});
			}

			const body = await req.json();

			const requiredFields = ["title", "company", "system", "genre", "release_year", "developer", "rating"];
			for (const field of requiredFields) {
				if (body[field] === undefined || body[field] === null) {
					return new Response(JSON.stringify({ error: `Missing required field: ${field}` }), {
						status: 400, headers: { "Content-Type": "application/json" } 
					});
				}
			}

			if (typeof body.release_year !== "number") {
				return new Response(JSON.stringify({ error: "release_year must be a number" }), { 
					status: 400, headers: { "Content-Type": "application/json" }
				});
			}
			if (typeof body.rating !== "number" || body.rating < 0 || body.rating > 10) {
				return new Response(JSON.stringify({ error: "rating must be a number between 0 and 10" }), {
					status: 400, headers: { "Content-Type": "application/json" }
				});
			}

			const updatedId = GameModel.update(id, body);

			return new Response(JSON.stringify({ success: true, id: updatedId }), {
				status: 200, headers: { "Content-Type": "application/json" }
			});
		} catch (error: any) {
			console.error("Failed to update game:", error);
			return new Response(JSON.stringify({ error: "Failed to update game", details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
		}
	},

  // DELETE /games/:id
	async delete(req: Request, id: number) {
		try {
			if (!id || isNaN(id)) {
				return new Response(JSON.stringify({ error: "Invalid game ID" }), { status: 400 });
			}

			GameModel.delete(id);
			return new Response(null, { status: 204 });
		} catch (error: any) {
			console.error("Failed to delete game:", error);
			return new Response(JSON.stringify({ error: "Failed to delete game", details: error.message }), {
				status: 500, 
			});
		}
	}
};
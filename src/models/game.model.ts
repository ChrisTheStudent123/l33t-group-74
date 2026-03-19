import { db } from "../db/database";

export const GameModel = {

	getAll(options: {
		search?: string;
		year?: number;
		comparator?: "gt" | "lt";
		page?: number;
		limit?: number;
		sort?: string;
		order?: "asc" | "desc";
	} = {}) {
		const { search, year, comparator, page, limit, sort = "g.id", order = "asc" } = options;

		const conditions: string[] = [];
		const params: (string | number)[] = [];

		if (search) {
			conditions.push("LOWER(g.title) LIKE LOWER(?)");
			params.push(`%${search}%`);
		}

		if (year !== undefined && comparator) {
			const operator = comparator === "gt" ? ">" : "<";
			conditions.push(`g.release_year ${operator} ?`);
			params.push(year);
		}

		let sql = `
			SELECT 
			g.id,
			g.title,
			g.release_year,
			g.developer,
			p.company,
			p.system,
			ge.genre,
			r.rating
			FROM games g
			LEFT JOIN platforms p ON g.platform_id = p.id
			LEFT JOIN genres ge ON g.genre_id = ge.id
			LEFT JOIN ratings r ON g.id = r.game_id
		`;

		if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

		sql += ` ORDER BY ${sort} ${order.toUpperCase()}`;

		if (limit !== undefined) {
			sql += " LIMIT ?";
			params.push(limit);

			if (page !== undefined) {
				const offset = (page - 1) * limit;
				sql += " OFFSET ?";
				params.push(offset);
			}
		} else if (page !== undefined) {
			const defaultLimit = 250;
			sql += " LIMIT ?";
			params.push(defaultLimit);

			const offset = (page - 1) * defaultLimit;
			sql += " OFFSET ?";
			params.push(offset);
		}

		return db.query(sql).all(...params);
	},

	getById(id: number) {
		return db.query(`
			SELECT 
			g.id,
			g.title,
			g.release_year,
			g.developer,
			p.company,
			p.system,
			ge.genre,
			r.rating
			FROM games g
			LEFT JOIN platforms p ON g.platform_id = p.id
			LEFT JOIN genres ge ON g.genre_id = ge.id
			LEFT JOIN ratings r ON g.id = r.game_id
			WHERE g.id = ?
		`).get(id);
	},

	create(game: any) {
		return db.transaction(() => {
			const platform = db.query(`SELECT id FROM platforms WHERE system = ? AND company = ?`).get(game.system, game.company);
			if (!platform) throw new Error("Platform not found");

			const genre = db.query(`SELECT id FROM genres WHERE genre = ?`).get(game.genre);
			if (!genre) throw new Error("Genre not found");

			const result = db.query(`
				INSERT INTO games (platform_id, genre_id, title, release_year, developer)
				VALUES (?, ?, ?, ?, ?)
			`).run(platform.id, genre.id, game.title, game.release_year, game.developer);

			const gameId = result.lastInsertRowid;

			db.query(`INSERT INTO ratings (game_id, rating) VALUES (?, ?)`).run(gameId, game.rating);

			return gameId;
		})();
	},

	update(id: number, game: any) {
		return db.transaction(() => {
			const platform = db.query(`SELECT id FROM platforms WHERE system = ? AND company = ?`).get(game.system, game.company);
			if (!platform) throw new Error("Platform not found");

			const genre = db.query(`SELECT id FROM genres WHERE genre = ?`).get(game.genre);
			if (!genre) throw new Error("Genre not found");

			db.query(`
				UPDATE games
				SET platform_id = ?, genre_id = ?, title = ?, release_year = ?, developer = ?
				WHERE id = ?
			`).run(platform.id, genre.id, game.title, game.release_year, game.developer, id);

			db.query(`UPDATE ratings SET rating = ? WHERE game_id = ?`).run(game.rating, id);

			return id;
		})();
	},

	delete(id: number) {
		return db.query(`DELETE FROM games WHERE id = ?`).run(id);
	}	
};
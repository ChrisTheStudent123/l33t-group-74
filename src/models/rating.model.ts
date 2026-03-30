import { db } from "../db/database";

export const RatingModel = {
  getAll(
    opts: {
      search?: string;
      rating?: number;
      comparator?: "gt" | "lt" | "eq";
      page?: number;
      limit?: number;
      sort?: string;
      order?: "asc" | "desc";
      gameId?: number;
    } = {},
  ) {
    const { search, rating, comparator, page, limit, sort = "r.id", order = "asc", gameId } = opts;

    const validColumns = ["r.id", "title", "rating"];

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    let stmt = `
      SELECT r.id as rating_id, r.rating, r.game_id, g.title as game_title
      FROM ratings r 
      JOIN  games g ON r.game_id = g.id
      `;

    //if this is set it should ignore all other parameters
    if (gameId) {
      stmt += "WHERE g.id = ?";
      params.push(`${gameId}`);
    } else {
      if (search) {
        conditions.push("LOWER(g.title) LIKE LOWER(?)");
        params.push(`%${search}`);
      }

      if (rating !== undefined && comparator) {
        let operator: ">" | "<" | "=" = "=";
        switch (comparator) {
          case "gt":
            operator = ">";
            break;
          case "lt":
            operator = "<";
            break;
        }
        conditions.push(`r.rating ${operator} ?`);
        params.push(rating);
      }
      const sortColumn = validColumns.includes(sort) ? sort : "r.id";
      const orderDir = order?.toLowerCase() === "desc" ? "DESC" : "ASC";

      if (conditions.length) {
        stmt += " WHERE " + conditions.join(" AND ");
      }
      stmt += ` ORDER BY ${sortColumn} ${orderDir}`;

      if (limit !== undefined) {
        stmt += " LIMIT ?";
        params.push(limit);

        if (page !== undefined) {
          const offset = (page - 1) * limit;
          stmt += " OFFSET ?";
          params.push(offset);
        }
      } else if (page !== undefined) {
        const defaultLimit = 250;
        stmt += " LIMIT ?";
        params.push(defaultLimit);

        const offset = (page - 1) * defaultLimit;
        stmt += " OFFSET ?";
        params.push(offset);
      }
    }
    console.log("stmt", stmt);
    console.log("params", ...params);

    return db.query(stmt).all(...params);
  },
  getById(id: number) {
    const stmt = db.query(`
      SELECT r.id as rating_id, r.rating, r.game_id, g.title as game_title
      FROM ratings r 
      JOIN  games g ON r.game_id = g.id
	    WHERE g.id = ?
      `);

    const result: any = stmt.get(id);
    return result;
  },
  getGameIdByGameId(gameId: number) {
    return db.query(`SELECT id FROM games WHERE id = ?`).get(gameId);
  },
  getGamesIdByTitle(gameTitle: string) {
    return db.query(`SELECT id FROM games WHERE LOWER(title) = LOWER(?)`).all(gameTitle);
  },
  getRatingsIdByGameId(gameId: number) {
    return db.query(`SELECT id FROM ratings WHERE game_id = ?`).get(gameId);
  },
  findRating(ratingId: number) {
    return db.query(`SELECT id FROM ratings WHERE id = ?`).get(ratingId);
  },
  create(gameId: number, rating: number) {
    return db.transaction(() => {
      const stmt = db
        .query(
          `
        INSERT INTO ratings (game_id, rating)
        VALUES (?, ?)
        `,
        )
        .run(gameId, rating);

      return stmt.lastInsertRowid;
    })();
  },
  update(rating: any) {
    return db.transaction(() => {
      const found: any = db.query(`SELECT id FROM ratings WHERE id = ?`).get(rating.id);
      if (!found) {
        throw new Error("Rating not found");
      }

      return rating.id;
    })();
  },
  delete(id: number) {
    return db.query(`DELETE FROM ratings WHERE id = ?`).run(id);
  },
};

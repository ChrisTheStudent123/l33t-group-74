import { db } from "../db/database";

export const RatingModel = {
  getAll(limit: number) {
    const stmt = db.query(`
      SELECT r.id, r.game_id, g.title as game_title, r.rating 
      FROM ratings r 
      JOIN  games g ON r.game_id = g.id
      LIMIT ?
      `);
    return stmt.all(limit);
  },
  getById(id: number) {
    const stmt = db.query(`
      SELECT r.id, r.game_id, g.title as game_title, r.rating 
      FROM ratings r 
      JOIN  games g ON r.game_id = g.id
	  WHERE g.id = ?
      `);

    const result: any = stmt.get(id);
    return result;
  },
  create(rating: any) {
    return db.transaction(() => {
      const duplicate: any = db.query(`SELECT id FROM ratings WHERE id = ?`).get(rating.game_id);
      if (duplicate.id !== undefined) {
        throw new Error("Rating for game already exists");
      }

      const game: any = db.query(`SELECT id FROM games WHERE id = ?`).get(rating.game_id);
      if (!game) {
        throw new Error("Game not found");
      }

      const stmt = db
        .query(
          `
        INSERT INTO ratings (game_id, rating)
        VALUES (?, ?)
        `,
        )
        .run(game.id, rating.rating);

      return db.query(`SELECT id FROM ratings WHERE id = ?`).get(stmt.lastInsertRowid);
    })();
  },

  update(rating: any) {
    return db.transaction(() => {
      return rating.id;
    })();
  },
};

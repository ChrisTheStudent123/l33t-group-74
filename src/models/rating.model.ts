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
      let gameId: number;

      if (rating.game_id) {
        gameId = rating.game_id;
      } else {
        const findGameId: any = db
          .query(`SELECT id FROM games WHERE title = ?`)
          .all(rating.game_title);

        if (findGameId.length === 1) {
          gameId = findGameId[0].id;
        } else if (findGameId.length > 1) {
          throw new Error("Multiple entries match game_title, try game_id instead");
        } else {
          throw new Error("Game not found");
        }
      }

      const duplicate: any = db.query(`SELECT id FROM ratings WHERE game_id = ?`).get(gameId);
      if (duplicate) {
        throw new Error("Game already has rating");
      }

      const game: any = db.query(`SELECT id FROM games WHERE id = ?`).get(gameId);
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
        .run(gameId, rating.rating);

      return db.query(`SELECT id FROM ratings WHERE id = ?`).get(stmt.lastInsertRowid);
    })();
  },

  update(rating: any) {
    return db.transaction(() => {
      return rating.id;
    })();
  },
  delete(id: number) {
    return db.query(`DELETE FROM ratings WHERE id = ?`).run(id);
  },
};

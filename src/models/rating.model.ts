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
  getGameIdByGameId(gameId: number) {
    const game: any = db.query(`SELECT id FROM games WHERE id = ?`).get(gameId);
    return game;
  },
  getGamesIdByTitle(gameTitle: string) {
    const findGameId: any = db.query(`SELECT id FROM games WHERE title = ?`).all(gameTitle);
    return findGameId;
  },
  getRatingsIdByGameId(gameId: number) {
    const duplicate: any = db.query(`SELECT id FROM ratings WHERE game_id = ?`).get(gameId);
    return duplicate;
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

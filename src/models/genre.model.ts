import { db } from "../db/database";

export const GenreModel = {
    getAll() {
        return db.query(`SELECT * FROM genres ORDER BY genre ASC`).all();
    },

    getById(id: number) {
        return db.query(`SELECT * FROM genres WHERE id = ?`).get(id);
    },

    create(genre: string) {
        const result = db.query(`INSERT INTO genres (genre) VALUES (?)`).run(genre);
        return result.lastInsertRowid;
    },

    update(id: number, genre: string) {
        const result = db.query(`UPDATE genres SET genre = ? WHERE id = ?`).run(genre, id);
        return result.changes > 0;
    },

    delete(id: number) {
        const result = db.query(`DELETE FROM genres WHERE id = ?`).run(id);
        return result.changes > 0;
    }
};
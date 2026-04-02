import { db } from "../db/database";

export const PlatformModel = {
    getAll(options: {
		system?: string;
		company?: string;
		page?: number;
		limit?: number;
		sort?: string;
		order?: "asc" | "desc";
	} = {}) {
        const { system, company, page, limit, sort = "p.id", order = "asc" } = options;

		const conditions: string[] = [];
		const params: (string | number)[] = [];

		if (system) {
			conditions.push("LOWER(p.system) LIKE LOWER(?)");
			params.push(`%${system}%`);
		}

		if (company) {
			conditions.push("LOWER(p.company) LIKE LOWER(?)");
			params.push(`%${company}%`);
		}

		let sql = `
			SELECT p.id,
                p.company,
                p.system
			FROM platforms p
		`;

		if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

		sql += ` ORDER BY ${sort} ${order.toUpperCase()}`;

        if (page !== undefined) {
            let i: number;
            i = limit !== undefined ? limit : 250;

            sql += " LIMIT ?";
            params.push(i);

            const offset = (page - 1) * i;
            sql += " OFFSET ?";
            params.push(offset);
        }

		return db.query(sql).all(...params);
	},

    getById(id: number) {
		return db.query(`
			SELECT p.id,
                p.company,
                p.system
			FROM platforms p
			WHERE p.id = ?
		`).get(id);
    },

    create(platform: any) {
		return db.transaction(() => {
			const result = db.query(`
				INSERT INTO platforms (company, system)
				VALUES (?, ?)
			`).run(platform.company, platform.system);

			return result.lastInsertRowid;
		})();
    },

    update(id: number, platform: any) {
		return db.transaction(() => {
			db.query(`
				UPDATE platforms
				SET company = ?, system = ?
				WHERE id = ?
			`).run(platform.company, platform.system, id);

			return id;
		})();
    },

    delete(id: number) {
        return db.query(`DELETE FROM platforms WHERE id = ?`).run(id);
    },
};
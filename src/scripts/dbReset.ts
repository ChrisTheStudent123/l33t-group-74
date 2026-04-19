import { db } from "../db/database";

function main() {
  try {
    const changes = db.run(`
		DROP TABLE IF EXISTS platforms;
		DROP TABLE IF EXISTS genres;
		DROP TABLE IF EXISTS games;
		DROP TABLE IF EXISTS ratings;
	`);
  } catch (e) {
    console.error("Failed to drop tables", e);
    return;
  }

  console.log("Database tables successfully dropped");
}

main();

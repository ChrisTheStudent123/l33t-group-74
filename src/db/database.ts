import { Database } from "bun:sqlite";

export const db = new Database("gameCollection.sqlite");

//Creates tables and populates with sample data
//if needing to expand fields for tables make neccessary changes in populateDb function as well as create statements
try {		
	db.run(`
		CREATE TABLE IF NOT EXISTS platforms (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		company TEXT NOT NULL,
		system TEXT NOT NULL
		);
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS genres (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		genre TEXT NOT NULL UNIQUE  
	);
	`);
		
	db.run(`	
		CREATE TABLE IF NOT EXISTS games (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		platform_id INTEGER,
		genre_id INTEGER,  
		title TEXT NOT NULL,
		release_year INTEGER NOT NULL,
		developer TEXT NOT NULL,
		FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
		FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL  
	);
	`);	

	db.run(`
		CREATE TABLE IF NOT EXISTS ratings (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		game_id INTEGER,
		rating INTEGER NOT NULL,
		FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
	);
	`);

    populateDb();
} catch (error) {
    console.error("Database operation failed:", error);
} finally {
    db.close(); //temp closing after populating, keep open for api or reopen elsewhere
}

function populateDb() {
    const insertPlatforms = db.prepare("INSERT INTO platforms (company, system) VALUES (?,?)");
    const insertGames = db.prepare("INSERT INTO games (platform_id, genre_id, title, release_year, developer) VALUES (?,?,?,?,?)");
    const insertGenres = db.prepare("INSERT INTO genres (genre) VALUES (?)");
    const insertRatings = db.prepare("INSERT INTO ratings (game_id, rating) VALUES (?,?)");

    const platforms = [
        { company: 'Sony', system: 'PlayStation 5' },
        { company: 'Sony', system: 'PlayStation 4' },
        { company: 'Sony', system: 'PlayStation 3' },
        { company: 'Microsoft', system: 'Xbox Series X/S' },
        { company: 'Microsoft', system: 'Xbox One' },
        { company: 'Microsoft', system: 'Xbox 360' },
        { company: 'Nintendo', system: 'Switch 2' },
        { company: 'Nintendo', system: 'Switch' },
        { company: 'Nintendo', system: 'Wii U' }
    ];

    const games = [
        { platformId: 1, genreId: 2, title: 'Elden Ring', releaseYear: 2022, developer: 'FromSoftware, Inc.' }, 
        { platformId: 1, genreId: 3, title: 'Astro Bot', releaseYear: 2024, developer: 'Team ASOBI' }, 
        { platformId: 1, genreId: 5, title: 'Tekken 8', releaseYear: 2024, developer: 'Bandai Namco Studios Inc.' },
        { platformId: 2, genreId: 2, title: 'Bloodborne', releaseYear: 2015, developer: 'FromSoftware, Inc.' }, 
        { platformId: 2, genreId: 1, title: 'Marvel Spider-Man', releaseYear: 2018, developer: 'FromSoftware, Inc.' }, 
        { platformId: 2, genreId: 3, title: 'Rayman Legends', releaseYear: 2013, developer: 'Ubisoft SARL' }, 
        { platformId: 3, genreId: 1, title: 'Uncharted 2: Among Thieves', releaseYear: 2009, developer: 'Naughty Dog, Inc.' }, 
        { platformId: 3, genreId: 1, title: 'Grand Theft Auto V', releaseYear: 2013, developer: 'Rockstar North Ltd.' },
        { platformId: 3, genreId: 7, title: 'Call of Duty 4: Modern Warfare', releaseYear: 2007, developer: 'Infinity Ward, Inc.' }, 
        { platformId: 4, genreId: 2, title: 'Clair Obscur: Expedition 33', releaseYear: 2025, developer: 'Sandfall SAS' }, 
        { platformId: 4, genreId: 8, title: 'Microsoft Flight Simulator', releaseYear: 2020, developer: 'Asobo Studio S.A.R.L.' }, 
        { platformId: 4, genreId: 4, title: 'Forza Horizon 5', releaseYear: 2021, developer: 'Playground Games Ltd' },
        { platformId: 5, genreId: 7, title: 'Doom Eternal', releaseYear: 2020, developer: 'id Software, Inc.' },
        { platformId: 5, genreId: 2, title: 'The Witcher 3: Wild Hunt', releaseYear: 2015, developer: 'CD Projekt RED' },
        { platformId: 5, genreId: 1, title: 'Outer Wilds', releaseYear: 2019, developer: 'Mobius Digital, LLC' },
        { platformId: 6, genreId: 6, title: 'Portal 2', releaseYear: 2011, developer: 'Valve Corporation' }, 
        { platformId: 6, genreId: 2, title: 'The Elder Scrolls IV: Oblivion', releaseYear: 2006, developer: 'Bethesda Game Studios' }, 
        { platformId: 6, genreId: 9, title: 'Rock Band 2', releaseYear: 2008, developer: 'Harmonix Music Systems, Inc.' },
        { platformId: 7, genreId: 1, title: 'Donkey Kong Bananza', releaseYear: 2025, developer: 'Nintendo EPD' },
        { platformId: 7, genreId: 4, title: 'Mario Kart World', releaseYear: 2025, developer: 'Nintendo EPD' }, 
        { platformId: 7, genreId: 4, title: 'Kirby Air Riders', releaseYear: 2025, developer: 'Sora Ltd.' },
        { platformId: 8, genreId: 3, title: 'Super Mario Odyssey', releaseYear: 2017, developer: 'Nintendo EPD' },
        { platformId: 8, genreId: 1, title: 'The Legend of Zelda: Breath of the Wild', releaseYear: 2017, developer: 'Nintendo EPD' },
        { platformId: 8, genreId: 5, title: 'Super Smash Bros. Ultimate', releaseYear: 2018, developer: 'Sora Ltd.' },
        { platformId: 9, genreId: 3, title: 'Super Mario 3D World', releaseYear: 2013, developer: 'Nintendo EAD' },
        { platformId: 9, genreId: 6, title: 'Pikmin 3', releaseYear: 2013, developer: 'Nintendo EAD' },
        { platformId: 9, genreId: 1, title: 'Bayonetta 2', releaseYear: 2014, developer: 'PlatinumGames Inc.' }
    ];

    const genres = [
        { genre: 'Action' }, 
        { genre: 'RPG' },
        { genre: 'Platformer' },
        { genre: 'Racing' },
        { genre: 'Fighting' },
        { genre: 'Puzzle/Strategy' },
        { genre: 'FPS' },
        { genre: 'Sim' },
        { genre: 'Rhythm' },
    ];

    const ratings = [
        { gameId: 1, rating: 9.2 },
        { gameId: 2, rating: 9.3 },
        { gameId: 3, rating: 8.8 },
        { gameId: 4, rating: 8.8 },
        { gameId: 5, rating: 8.8 },
        { gameId: 6, rating: 8.9 },
        { gameId: 7, rating: 9.1 },
        { gameId: 8, rating: 9.0 },
        { gameId: 9, rating: 8.7 },
        { gameId: 10, rating: 9.2 },
        { gameId: 11, rating: 8.4 },
        { gameId: 12, rating: 9.0 },
        { gameId: 13, rating: 8.7 },
        { gameId: 14, rating: 9.0 },
        { gameId: 15, rating: 8.6 },
        { gameId: 16, rating: 9.0 },
        { gameId: 17, rating: 8.6 },
        { gameId: 18, rating: 8.7 },
        { gameId: 19, rating: 9.0 },
        { gameId: 20, rating: 8.4 },
        { gameId: 21, rating: 7.7 },
        { gameId: 22, rating: 9.4 },
        { gameId: 23, rating: 9.3 },
        { gameId: 24, rating: 9.1 },
        { gameId: 25, rating: 9.0 },
        { gameId: 26, rating: 8.6 },
        { gameId: 27, rating: 8.9 }
    ];


    const isPlatformsEmpty = db.prepare("SELECT COUNT(*) AS count FROM platforms").get().count === 0;
    const isGenresEmpty = db.prepare("SELECT COUNT(*) AS count FROM genres").get().count === 0;
    const isGamesEmpty = db.prepare("SELECT COUNT(*) AS count FROM games").get().count === 0;
    const isRatingsEmpty = db.prepare("SELECT COUNT(*) AS count FROM ratings").get().count === 0;

    if (isPlatformsEmpty) {
        platforms.forEach(platform => {
            insertPlatforms.run(platform.company, platform.system);
        });
    }

    if (isGenresEmpty) {
        genres.forEach(genre => {
            insertGenres.run(genre.genre);
        });
    }

    if (isGamesEmpty) {
        games.forEach(game => {
            insertGames.run(game.platformId, game.genreId, game.title, game.releaseYear, game.developer);
        });
    }

    if (isRatingsEmpty) {
        ratings.forEach(rating => {
            insertRatings.run(rating.gameId, rating.rating);
        });
    }

    insertPlatforms.finalize();
    insertGames.finalize();
    insertGenres.finalize();
    insertRatings.finalize();	
}
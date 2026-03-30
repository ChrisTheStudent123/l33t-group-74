import { GenreController } from "../controllers/genre.controller";

export async function genreRoute(req: Request) {
    const url = new URL(req.url);
    const pathname = url.pathname.trim();
    const method = req.method;

    if (pathname === "/genres") {
        if (method === "GET") return GenreController.getAll(req);
        if (method === "POST") return GenreController.create(req);
    }

    const genreIdMatch = pathname.match(/^\/genres\/(\d+)$/);
    if (genreIdMatch) {
        const id = Number(genreIdMatch[1]);
        if (method === "GET") return GenreController.getById(req, id);
        if (method === "PUT") return GenreController.update(req, id);
        if (method === "DELETE") return GenreController.delete(req, id);
    }

    return new Response("Not found", { status: 404 });
}
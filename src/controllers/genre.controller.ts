import { GenreModel } from "../models/genre.model";

export const GenreController = {
    async getAll(req: Request) {
        try {
            const genres = GenreModel.getAll();
            return new Response(JSON.stringify(genres), {
                status: 200, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            return new Response(JSON.stringify({ error: "Failed to fetch genres" }), { status: 500 });
        }
    },

    async getById(req: Request, id: number) {
        try {
            const genre = GenreModel.getById(id);
            if (!genre) return new Response(JSON.stringify({ error: "Genre not found" }), { status: 404 });

            return new Response(JSON.stringify(genre), {
                status: 200, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            return new Response(JSON.stringify({ error: "Failed to fetch genre" }), { status: 500 });
        }
    },

    async create(req: Request) {
        try {
            const body = await req.json();
            if (!body.genre || typeof body.genre !== "string" || body.genre.trim() === "") {
                return new Response(JSON.stringify({ error: "genre is required and must be a non-empty string" }), { status: 400 });
            }

            const id = GenreModel.create(body.genre.trim());
            return new Response(JSON.stringify({ id, genre: body.genre.trim() }), {
                status: 201, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            if (error.message.includes("UNIQUE constraint failed")) {
                return new Response(JSON.stringify({ error: "Genre already exists" }), { status: 409 });
            }
            return new Response(JSON.stringify({ error: "Failed to create genre" }), { status: 500 });
        }
    },

    async update(req: Request, id: number) {
        try {
            const body = await req.json();
            if (!body.genre || typeof body.genre !== "string" || body.genre.trim() === "") {
                return new Response(JSON.stringify({ error: "genre is required and must be a non-empty string" }), { status: 400 });
            }

            const updated = GenreModel.update(id, body.genre.trim());
            if (!updated) return new Response(JSON.stringify({ error: "Genre not found" }), { status: 404 });

            return new Response(JSON.stringify({ success: true, id }), {
                status: 200, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            if (error.message.includes("UNIQUE constraint failed")) {
                return new Response(JSON.stringify({ error: "Genre name already in use" }), { status: 409 });
            }
            return new Response(JSON.stringify({ error: "Failed to update genre" }), { status: 500 });
        }
    },

    async delete(req: Request, id: number) {
        try {
            const deleted = GenreModel.delete(id);
            if (!deleted) return new Response(JSON.stringify({ error: "Genre not found" }), { status: 404 });

            return new Response(null, { status: 204 });
        } catch (error: any) {
            return new Response(JSON.stringify({ error: "Failed to delete genre" }), { status: 500 });
        }
    }
};
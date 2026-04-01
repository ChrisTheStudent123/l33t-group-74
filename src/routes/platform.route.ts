import { PlatformController } from "../controllers/platform.controller";

export async function platformRoute(req: Request) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    // /platforms
    if (pathname === "/platforms") {
        if (method === "GET") {
            //GET /platforms
            return PlatformController.getAll(req);
        }
        else if (method === "POST") {
            //POST /platforms
            return PlatformController.create(req);
        }
    }

    // /platforms/:id
    const platformIdIdMatch = pathname.match(/^\/platforms\/(\d+)$/);
    if (platformIdIdMatch) {
        const id = Number(platformIdIdMatch[1]);
        if (method === "GET") {
            // GET /platforms/:id
            return PlatformController.getById(req, id);
        }
        else if (method === "PUT") {
            // PUT /platforms/:id
            return PlatformController.update(req, id);
        }
        else if (method === "DELETE") {
            // DELETE /platforms/:id
            return PlatformController.delete(req, id);
        }
    }

    // Fallback
    return new Response("Not found", { status: 404 });
}
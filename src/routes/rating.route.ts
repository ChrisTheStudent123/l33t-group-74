import { RatingController } from "../controllers/rating.controller";

function matchRegexId(pathname: string): any {
  return pathname.match(/^\/ratings\/(\d+)$/);
}

export async function ratingRoute(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  if (method === "GET") {
    if (pathname === "/ratings" || pathname === "/ratings/") {
      return RatingController.list();
    }
    const match = matchRegexId(pathname);
    if (match) {
      return RatingController.getById(Number(match[1]));
    }
  }

  if (method === "POST") {
    return RatingController.create(req);
  }

  if (method === "PUT") {
    const match = matchRegexId(pathname);
    if (match) {
      return RatingController.update(req, Number(match[1]));
    }
  }

  if (method === "DELETE") {
    const match = matchRegexId(pathname);
    if (match) {
      return RatingController.delete(Number(match[1]));
    }
  }

  return new Response("Not found", { status: 404 });
}

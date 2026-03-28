import { jsonError, readJson } from "../utils/http";
import { RatingModel } from "../models/rating.model";

function addHeaders() {
  return { "Content-Type": "application/json" };
}

//should be unncessary
function validateNumberType(num: any): Boolean {
  if (!num || isNaN(num)) {
    return false;
  }
  return true;
}

function validateRatingFound(rating: any) {
  if (!rating) {
    return new Response(JSON.stringify({ error: "Rating not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function successResponse(data: any, status: number): Response {
  return Response.json({ data }, { status, headers: { "Content-Type": "application/json" } });
}

function errorResponse(errorMessage: string, status: number): Response {
  return new Response(JSON.stringify({ error: errorMessage }), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonResponse(object: any, status: number): Response {
  return new Response(JSON.stringify(object), {
    status: status,
    headers: { "Content-Type": "application/json" },
  });
}

function validateString(value: any): boolean {
  if (typeof value === "string" && value.trim() !== "") {
    return true;
  }
  return false;
}

function validateNumber(value: any): boolean {
  if (typeof value === "number") {
    return true;
  }
  return false;
}

function validateRating(value: number): boolean {
  if (value >= 0 && value <= 10) {
    return true;
  }
  return false;
}

export const RatingController = {
  async list(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const search = url.searchParams.get("q") || undefined;
      const yearParam = url.searchParams.get("year");
      const year = yearParam ? Number(yearParam) : undefined;

      if (validateNumberType(year)) {
        return errorResponse("Invalid tear parameter", 400);
      }

      const comparator = url.searchParams.get("cmp") as "gt" | "lt" | undefined;
      if (comparator && comparator !== "gt" && comparator !== "lt") {
        return errorResponse("Comparator must be 'gt' or 'lt'", 400);
      }

      const possibleParams = [
        "game_id",
        "title",
        "release_year",
        "developer",
        "company",
        "system",
        "genre",
        "rating",
      ];

      const limit = 99;
      const ratings = await RatingModel.getAll(limit);
      return successResponse(ratings, 200);
    } catch (e: any) {
      console.log(e);
      return errorResponse("Failed to fetch ratings", 500);
    }
  },

  async getById(id: number): Promise<Response> {
    try {
      if (!validateNumberType(id)) {
        return errorResponse("Invalid rating id", 400);
      }

      const rating = await RatingModel.getById(id);
      if (!rating) {
        return errorResponse("Rating not found", 404);
      }
      return successResponse(rating, 200);
    } catch (e: any) {
      console.log(e);
      return errorResponse("Failed to fetch rating", 500);
    }
  },
  async create(req: Request): Promise<Response> {
    try {
      const body: any = await req.json();

      if (body["rating"] === undefined) {
        return errorResponse("Missing required field: rating", 400);
      }
      if (body["game_id"] === undefined && body["game_title"] === undefined) {
        return errorResponse("Missing required field: either game_id or game_title", 400);
      }
      if (typeof body["rating"] !== "number") {
        return errorResponse("Rating must be a number", 400);
      }
      if (!validateRating(body["rating"])) {
        return errorResponse("Rating must be between 0 and 10", 400);
      }

      let gameId: number;
      if (body.game_id) {
        gameId = body.game_id;
      } else {
        const findGameId: any = RatingModel.getGamesIdByTitle(body.game_title);
        if (findGameId.length === 1) {
          gameId = findGameId[0].id;
        } else if (findGameId.length > 1) {
          return errorResponse("Multiple entries match game_title, try game_id instead", 422);
        } else {
          return errorResponse("Game title not found", 400);
        }
      }

      const duplicate: any = RatingModel.getRatingsIdByGameId(gameId);
      if (duplicate) {
        return errorResponse("Game already has rating", 422);
      }

      const gameFound: any = RatingModel.getGameIdByGameId(gameId);
      if (!gameFound) {
        return errorResponse("Game id not found", 400);
      }

      const rating = RatingModel.create(gameId, body.rating);

      return new Response(JSON.stringify({ rating }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: any) {
      console.log(e);
      return errorResponse("Failed to create a new rating", 500);
    }
  },
  async update(req: Request, id: number): Promise<Response> {
    try {
      const body: any = await req.json();
      //would it even make it this far if it didn't pass regex?
      if (!validateNumberType(id)) {
        return errorResponse("Invalid rating id", 400);
      }
      if (body["rating"] === undefined) {
        return errorResponse("Missing required field: rating", 400);
      }
      if (!validateRating(body["rating"])) {
        return errorResponse("Rating must be between 0 and 10", 400);
      }

      const data: string = "placeholder";
      return successResponse(data, 200);
    } catch (e: any) {
      console.log(e);
      return errorResponse("Failed to update rating", 500);
    }
  },
  async delete(id: number): Promise<Response> {
    try {
      if (!validateNumberType(id)) {
        return errorResponse("Invalid rating id", 400);
      }
      const status = RatingModel.delete(id);
      console.log("status", status);
      if (!status.changes) {
        return errorResponse("Rating not found", 404);
      }
      return new Response(null, { status: 204 });
    } catch (e: any) {
      console.log(e);
      return errorResponse("Failed to delete rating", 500);
    }
  },
};

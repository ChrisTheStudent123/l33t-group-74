import { jsonError, readJson } from "../utils/http";
import { RatingModel } from "../models/rating.model";

function addHeaders() {
  return { "Content-Type": "application/json" };
}

//should be unncessary
function validateIdType(id: number): Boolean {
  if (!id || isNaN(id)) {
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
  if (value > 0 && value < 10) {
    return true;
  }
  return false;
}

export const RatingController = {
  async list(): Promise<Response> {
    try {
      const limit = 99;
      const ratings = await RatingModel.getAll(limit);
      return successResponse(ratings, 200);
    } catch (e: any) {
      console.log(e);
      //return jsonError(500, { error: "ServerError", message: "Unexpected server error" });
      console.log(e.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch ratings", details: e.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },

  async getById(id: number): Promise<Response> {
    try {
      if (!validateIdType(id)) {
        return new Response(JSON.stringify({ error: "Invalid rating id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const rating = await RatingModel.getById(id);
      if (!rating) {
        return new Response(JSON.stringify({ error: "Rating not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return successResponse(rating, 200);
    } catch (e: any) {
      console.log(e.message);
      return new Response(
        JSON.stringify({ error: "Failed to fetch that rating", details: e.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
  async create(req: Request): Promise<Response> {
    try {
      const body: any = await req.json();

      if (body["rating"] === undefined) {
        return new Response(JSON.stringify({ error: `Missing required field: rating` }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (body["game_id"] === undefined && body["game_title"] === undefined) {
        return new Response(
          JSON.stringify({ error: `Missing required field: either game_id or game_title` }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const rating = RatingModel.create(body);

      return new Response(JSON.stringify({ rating }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: any) {
      console.log(e.message);
      return new Response(
        JSON.stringify({ error: "Failed to create new rating", details: e.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
  async update(req: Request, id: number): Promise<Response> {
    try {
      if (!validateIdType(id)) {
        return new Response(JSON.stringify({ error: "Invalid rating id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const body = await req.json();

      const data: string = "placeholder";
      return successResponse(data, 200);
    } catch (e: any) {
      console.log(e.message);
      return new Response(
        JSON.stringify({ error: "Failed to update that rating", details: e.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
  async delete(id: number): Promise<Response> {
    try {
      if (!validateIdType(id)) {
        return new Response(JSON.stringify({ error: "Invalid rating id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const status = RatingModel.delete(id);
      console.log("status", status);
      if (!status.changes) {
        return new Response(JSON.stringify({ error: "Rating not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(null, { status: 204 });
    } catch (e: any) {
      console.log(e.message);
      return new Response(
        JSON.stringify({ error: "Failed to delete that rating", details: e.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};

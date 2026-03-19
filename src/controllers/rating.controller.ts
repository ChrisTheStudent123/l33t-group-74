import { jsonError, readJson } from "../utils/http";

export const RatingController = {
  async list(req: Request) {
    try {
    
        const ratings
        return Response.json({data: })
    } catch (e) {
      console.log(e);
      return jsonError(500, { error: "ServerError", message: "Unexpected server error" });
    }
  },
};

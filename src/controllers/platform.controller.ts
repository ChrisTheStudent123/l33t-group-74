import { PlatformModel } from "../models/platform.model";

export const PlatformController = {
    //GET /platforms
    async getAll(req: Request) {
        try {
            const url = new URL(req.url);

            const validSortColumns = [
                "system",
                "company",
            ];
            
            const system = url.searchParams.get("system") || undefined;
            const company = url.searchParams.get("company") || undefined;

            const sortParam = url.searchParams.get("sort");
    
            const order = (url.searchParams.get("order") || "asc").toLowerCase() as "asc" | "desc";
    
            const pageParam = url.searchParams.get("page");
            const page = pageParam ? Number(pageParam) : undefined;
    
            const limitParam = url.searchParams.get("limit");
            const limit = limitParam ? Number(limitParam) : undefined;

            let sortColumn: string;
            if (sortParam && validSortColumns.includes(sortParam)) {
                sortColumn = sortParam;
            } else {
                sortColumn = "p.id";
            }
    
            const platforms = PlatformModel.getAll({ system, company, page, limit, sort: sortColumn, order });
            return new Response(JSON.stringify(platforms), { 
                status: 200, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            const err = "Failed to fetch platforms"
			return new Response(JSON.stringify({ error: err, details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
        }
    },

    // GET /platforms/:id
    async getById(req: Request, id: number) {
        try {
            if (!id || isNaN(id)) {
                const err = "Invalid platform ID"
				return new Response(JSON.stringify({ error: err }), { 
					status: 400, headers: { "Content-Type": "application/json" } 
				});
			}

            const platform = PlatformModel.getById(id);
            if (!platform) {
                const err = "Platform not found"
                return new Response(JSON.stringify({ error: err }), { 
                    status: 404,  headers: { "Content-Type": "application/json" }
                });
            }

            return new Response(JSON.stringify(platform), {
				status: 200, headers: { "Content-Type": "application/json" }
			});
        } catch (error: any) {
            const err = "Failed to fetch platform by ID"
			return new Response(JSON.stringify({ error: err, details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
        }
    },

    // POST /platforms
    async create(req: Request) {
        try {
            const body = await req.json();
            const requiredFields = [
                "company",
                "system"
            ];

            for (const f of requiredFields) {
                if (body[f] === undefined || body[f] === null) {
                    const err = `Missing required field: ${f}`
                    return new Response(JSON.stringify({ error: err }), {
                        status: 422, headers: { "Content-Type": "application/json" } 
                    });
                }
            }

            if (typeof body.company !== "string" || body.company.trim() === "") {
                const err = "Company must be a non-empty string"
                return new Response(JSON.stringify({ error: err }), { 
                    status: 400, headers: { "Content-Type": "application/json" }
                });
            }

            if (typeof body.system !== "string" || body.system.trim() === "") {
                const err = "System must be a non-empty string"
                return new Response(JSON.stringify({ error: err }), { 
                    status: 400, headers: { "Content-Type": "application/json" }
                });
            }

            const id = PlatformModel.create(body);

            return new Response(JSON.stringify({ id }), {
                status: 201, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            const err = "Failed to create platform"
			return new Response(JSON.stringify({ error: err, details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
        }
    },

    // PUT /platforms/:id
    async update(req: Request, id: number) {
        try {
            const requiredFields = [
                "company",
                "system",
            ];

            const body = await req.json();

            if (!id || isNaN(id) || (await this.getById(req, id)).status !== 200) {
                const err = "Invalid platform ID"
                return new Response(JSON.stringify({ error: err }), { 
                    status: 400, headers: { "Content-Type": "application/json" }
                });
            }

            for (const f of requiredFields) {
                if (body[f] === undefined || body[f] === null) {
                    const err = `Missing required field: ${f}`
                    return new Response(JSON.stringify({ error: err }), {
                        status: 400, headers: { "Content-Type": "application/json" } 
                    });
                }
            }

            const updatedId = PlatformModel.update(id, body);

            return new Response(JSON.stringify({ success: true, id: updatedId }), {
                status: 200, headers: { "Content-Type": "application/json" }
            });
        } catch (error: any) {
            const err = "Failed to update platform"
			return new Response(JSON.stringify({ error: err, details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
        }
    },

    // DELETE /platforms/:id
    async delete(req: Request, id: number) {
        try {
            if (!id || isNaN(id) || (await this.getById(req, id)).status !== 200) {
                const err = "Invalid platform ID"
				return new Response(JSON.stringify({ error: err }), { status: 400 });
			}
            PlatformModel.delete(id);
            return new Response(null, { status: 204 });
        } catch (error: any) {
            const err = "Failed to delete platform"
			return new Response(JSON.stringify({ error: err, details: error.message }), {
				status: 500, headers: { "Content-Type": "application/json" }
			});
        }
    },
};
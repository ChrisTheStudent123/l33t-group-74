type ApiError = {
    error: string;
    message: string;
    details?: unknown;
}

export async function readJson(req: Request) {
    try {
        return await req.json();
    } catch {
        return null;
    }
}

export async function jsonError(status: number, error: ApiError) {
    return Response.json(error, { status });
}
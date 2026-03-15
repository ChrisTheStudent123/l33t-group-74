type ValidationError = { field: string; message: string };

export function validateGameCreate(body: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof body?.name != "string") {
    errors.push({ field: "name", message: "name must be a string" });
  } else {
    const nameLength = body.name.trim().length;
    if (nameLength < 2) {
      errors.push({ field: "name", message: "name must have a min of 2 chars" });
    } else if (nameLength > 40) {
      errors.push({ field: "name", message: "name has a max of 40 chars" });
    }
  }

  if ("description" in body) {
    if (typeof body?.description != "string") {
      errors.push({ field: "description", message: "description must be a string" });
    } else if (body.desciption.trim().length > 256) {
      errors.push({ field: "description", message: "description has a max of 256 chars" });
    }
  }

  return errors;
}

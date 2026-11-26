import { createError } from "@middy/util";

export const validate = (schema) => ({
  before: async (request) => {
    const result = schema.safeParse(request.event.body);
    if (!result.success) {
      throw createError(400, result.error.issues[0].message);
    }
    request.event.body = result.data;
  },
});

import { createError } from "@middy/util";
import { verifyToken } from "../utils/jwt.mjs";

export const authenticate = () => ({
  before: async (request) => {
    const header = request.event.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw createError(401, "Missing token");
    }
    const token = header.split(" ")[1];
    try {
      const payload = verifyToken(token);
      request.event.user = { username: payload.username };
    } catch {
      throw createError(401, "Invalid or expired token");
    }
  },
});

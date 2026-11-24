import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { createError } from "@middy/util";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { createUser, getUserByUsername } from "../../services/users.mjs";
import { hashPassword } from "../../utils/bcrypt.mjs";

const registerHandler = async (event) => {
  const { username, password } = event.body;

  if (!username || !password) {
    throw createError(400, "username and password are required");
  }
  if (password.length < 10) {
    throw createError(400, `password has to be at least 10 characters`);
  }
  if (await getUserByUsername(username)) {
    throw createError(409, "Username already exists");
  }

  const hashed = await hashPassword(password);

  await createUser({ username, password: hashed });
  return sendResponse(201, {
    message: "User registered successfully",
    username,
  });
};

export const handler = middy(registerHandler)
  .use(httpJsonBodyParser())
  .use(errorHandler());

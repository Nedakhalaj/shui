import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { createError } from "@middy/util";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { getUserByUsername } from "../../services/users.mjs";
import { signToken } from "../../utils/jwt.mjs";
import { comparePassword } from "../../utils/bcrypt.mjs";


const loginHandler = async (event) => {
  const { username, password } = event.body;

  if (!username || !password) {
    throw createError(400, "username and password are required");
  }
  const user = await getUserByUsername(username);

  if (!user) {
    throw createError(401, "Wrong username or password");
  }

  if (await comparePassword(password, user.password) === false){
     throw createError(401, "Wrong username or password");
}
  const token = signToken(username);
  return sendResponse(200, {message: "Login successful", token, username });
}

export const handler = middy(loginHandler)
.use(httpJsonBodyParser())
.use(errorHandler())
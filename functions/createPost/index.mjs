import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { createError } from "@middy/util";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { randomUUID } from "node:crypto";
import { createPost } from "../../services/posts.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";

const createPostHandler = async (event) => {
  const { title, content } = event.body;
  if (!title || !content) {
    throw createError(400, "title and content are required");
  }
  const now = new Date().toISOString();
  const post = {
    id: randomUUID(),
    username: event.user.username,
    isGuest: false,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
  await createPost(post);
  return sendResponse(201, { message: "Post created successfully", post });
};

export const handler = middy(createPostHandler)
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(errorHandler());

import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { randomUUID, randomInt } from "node:crypto";
import { optionalAuthenticate } from "../../middlewares/optionalAuthenticate.mjs";
import { createPost } from "../../services/posts.mjs";
import { validate } from "../../middlewares/validate.mjs";
import { postSchema } from "../../models/postSchemas.mjs";

const createPostHandler = async (event) => {
  const { title, content } = event.body;

  const now = new Date().toISOString();
  const isGuest = !event.user;
  const post = {
    id: randomUUID(),
    username: isGuest ? `guest${randomInt(1000, 10000)}` : event.user.username,
    isGuest,
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
  .use(optionalAuthenticate())
  .use(validate(postSchema))
  .use(errorHandler());

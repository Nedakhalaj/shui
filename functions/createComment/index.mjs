import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { randomUUID } from "node:crypto";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { getPostById } from "../../services/posts.mjs";
import { validate } from "../../middlewares/validate.mjs";
import { createError } from "@middy/util";
import { createComment } from "../../services/comments.mjs";
import { commentSchema } from "../../models/commentSchemas.mjs";

const createCommentHandler = async (event) => {
  const postId = event.pathParameters.postId;
  const { content } = event.body;
  const post = await getPostById(postId);
  if (!post) {
    throw createError(404, "Post not found");
  }
  const now = new Date().toISOString();
  const comment = {
    id: randomUUID(),
    postId,
    username: event.user.username,
    content,
    createdAt : now
  };
  await createComment(comment);
  return sendResponse(201, {
    message: "Comment created successfully",
    comment,
  });
};

export const handler = middy(createCommentHandler)
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(validate(commentSchema))
  .use(errorHandler());

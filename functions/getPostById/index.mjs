import middy from "@middy/core";
import { createError } from "@middy/util";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { getPostById } from "../../services/posts.mjs";

const getPostByIdHandler = async (event) => {
  const postId = event.pathParameters.postId;
  const post = await getPostById(postId);
  if (!post) {
    throw createError(404, "Post not found");
  }

  return sendResponse(200, post);
};

export const handler = middy(getPostByIdHandler).use(errorHandler());

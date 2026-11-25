import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { createError } from "@middy/util";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { getPostById, updatePost } from "../../services/posts.mjs";

const updatePostHandler = async (event) => {
  const postId = event.pathParameters.postId;
  const { title, content } = event.body;
  if (!title || !content) {
    throw createError(400, "title and content are required");
  }
  const post = await getPostById(postId);
  if (!post) {
    throw createError(404, "Post not found");
  }
  if (post.username !== event.user.username) {
    throw createError(403, "You can only edit your own posts");
  }

  const updated = {
    ...post,
    title,
    content,
    updatedAt: new Date().toISOString(),
  };
  await updatePost(updated);
  return sendResponse(200, {
    message: "Post updated successfully",
    post: updated,
  });
};

export const handler = middy(updatePostHandler)
  .use(httpJsonBodyParser())
  .use(authenticate())
  .use(errorHandler());

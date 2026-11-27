import middy from "@middy/core";
import { createError } from "@middy/util";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { authenticate } from "../../middlewares/authenticate.mjs";
import { getPostById, deletePost } from "../../services/posts.mjs";

const deletePostHandler = async (event) => {
  const postId = event.pathParameters.postId;
  const post = await getPostById(postId);
  if (!post) {
    throw createError(404, "Post not found");
  }
  if (post.isGuest || post.username !== event.user.username) {
    throw createError(403, "You can only delete your own posts");
  }

  await deletePost(postId);
  return sendResponse(204);
};

export const handler = middy(deletePostHandler)
  .use(authenticate())
  .use(errorHandler());

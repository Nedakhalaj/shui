import middy from "@middy/core";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { getPostById } from "../../services/posts.mjs";
import { createError } from "@middy/util";
import { getCommentsByPostId } from "../../services/comments.mjs"

const getCommentsHandler = async (event) => {
  const postId = event.pathParameters.postId
  const post = await getPostById(postId)
  if(!post){
    throw createError(404, "Post not found" )
  }
  const comments = await getCommentsByPostId(postId);
  comments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return sendResponse(200, comments);
};

export const handler = middy(getCommentsHandler).use(errorHandler());
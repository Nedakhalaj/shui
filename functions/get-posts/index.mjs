import middy from "@middy/core";
import { sendResponse } from "../../services/responses.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { getAllPosts } from "../../services/posts.mjs";

const getPostsHandler = async (event) => {
  let posts = await getAllPosts();
  const username = event.queryStringParameters?.username;
  if (username) {
    posts = posts.filter((post) => post.username === username);
  }
  posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sendResponse(200, posts);
};

export const handler = middy(getPostsHandler).use(errorHandler());

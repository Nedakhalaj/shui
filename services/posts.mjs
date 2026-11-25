import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "./db.mjs";

export const createPost = async (post) => {
  await db.send(
    new PutCommand({
      TableName: TABLES.posts,
      Item: post,
    }),
  );
};

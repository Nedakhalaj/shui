import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "./db.mjs";

export const createComment = async (comment) => {
  await db.send(
    new PutCommand({
      TableName: TABLES.comments,
      Item: comment,
    }),
  );
};

export const getCommentsByPostId = async (postId) => {
 const result  = await db.send(
  new QueryCommand({
    TableName: TABLES.comments,
    KeyConditionExpression: "postId = :postId", // "only this post"
    ExpressionAttributeValues: { ":postId": postId }, // the real value
  }),
);
return result.Items;
};


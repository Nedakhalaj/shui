import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "./db.mjs";

export const createComment = async (comment) => {
  await db.send(
    new PutCommand({
      TableName: TABLES.comments,
      Item: comment,
    }),
  );
};
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { db, TABLES } from "./db.mjs";

export const createUser = async (user) => {
  await db.send(
    new PutCommand({
      TableName: TABLES.users,
      Item: user,
    }),
  );
};

export const getUserByUsername = async (username) => {
  const { Item } = await db.send(
    new GetCommand({
      TableName: TABLES.users,
      Key: { username },
    }),
  );
  return Item;
};

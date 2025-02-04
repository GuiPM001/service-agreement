import { Collection, Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "reboque-prime";

let client: MongoClient;
let db: Db;
let collection: Collection;

declare global {
  var _mongoClient: MongoClient | undefined;
}

if (!global._mongoClient) {
  client = new MongoClient(MONGODB_URI);
  global._mongoClient = client;
} else {
  client = global._mongoClient;
}

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection("services");
  }

  return collection;
}
import { Collection, Db, MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "reboque-prime";

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClient?: MongoClient;
    }
  }
}

const globalAny = global as unknown as NodeJS.Global;

let client: MongoClient;
let db: Db;
let collection: Collection;

if (!globalAny._mongoClient) {
  client = new MongoClient(MONGODB_URI);
  globalAny._mongoClient = client;
} else {
  client = globalAny._mongoClient;
}

export async function connectDB(): Promise<Collection> {
  if (!db) {
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection("services");
  }

  return collection;
}

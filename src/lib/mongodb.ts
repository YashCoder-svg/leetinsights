import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  try {
    if (process.env.NODE_ENV === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
      };

      if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
      }
      clientPromise = globalWithMongo._mongoClientPromise;
    } else {
      // In production mode, avoid global variables.
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  } catch (error) {
    console.error("MongoDB initialization failed: ", error);
  }
} else {
  console.warn(
    "💡 [DATABASE] MONGODB_URI environment variable is missing. Cache will run in-memory bypass mode."
  );
}

export { clientPromise };

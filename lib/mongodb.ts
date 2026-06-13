import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;

function getClientOptions(): MongoClientOptions {
  const allowInsecureTls =
    process.env.MONGODB_TLS_INSECURE === "true" ||
    process.env.NODE_ENV === "development";

  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    maxPoolSize: 5,
  };

  if (allowInsecureTls) {
    options.tlsAllowInvalidCertificates = true;
  }

  return options;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, getClientOptions());
      global._mongoClientPromise = client.connect().catch((error) => {
        global._mongoClientPromise = undefined;
        throw error;
      });
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri, getClientOptions());
  return client.connect();
}

export async function pingDatabase() {
  const client = await getMongoClient();
  await client.db("admin").command({ ping: 1 });
  return client;
}

import { MongoClient, type MongoClientOptions } from "mongodb";

const rawUri = process.env.MONGODB_URI;

function getMongoUri() {
  if (!rawUri) {
    return null;
  }

  const uri = rawUri.trim();

  if (uri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(uri)) {
    const separator = uri.includes("?") ? "&" : "?";
    return `${uri}${separator}ssl=true&retryWrites=true&w=majority`;
  }

  return uri;
}

function getClientOptions(): MongoClientOptions {
  const allowInsecureTls =
    process.env.MONGODB_TLS_INSECURE === "true" ||
    process.env.NODE_ENV === "development";

  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    family: 4,
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

export function resetMongoClient() {
  global._mongoClientPromise = undefined;
}

export function getMongoConnectionErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/SSL|TLS|tlsv1|alert number 80/i.test(message)) {
    return "MongoDB SSL connection failed on live server. Add MONGODB_URI and MONGODB_TLS_INSECURE=true in Vercel env vars, then allow 0.0.0.0/0 in MongoDB Atlas Network Access.";
  }

  if (/authentication failed|bad auth|invalid credentials/i.test(message)) {
    return "MongoDB login failed. Check MONGODB_URI username and password in Vercel environment variables.";
  }

  if (/MONGODB_URI is not set/i.test(message)) {
    return "MONGODB_URI is not configured on the live server. Add it in Vercel environment variables.";
  }

  return "Could not save to database. Please check MongoDB Atlas connection settings.";
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = getMongoUri();

  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, getClientOptions());
    global._mongoClientPromise = client.connect().catch((error) => {
      resetMongoClient();
      throw error;
    });
  }

  return global._mongoClientPromise;
}

export async function pingDatabase() {
  const client = await getMongoClient();
  await client.db("admin").command({ ping: 1 });
  return client;
}

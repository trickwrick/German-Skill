const { MongoClient } = require("mongodb");
const { readFileSync } = require("fs");
const { resolve } = require("path");

function loadEnv() {
  const envPath = resolve(__dirname, "../.env");
  const envContent = readFileSync(envPath, "utf8");
  const vars = {};

  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    vars[key] = value;
  }

  return vars;
}

function getClientOptions(env) {
  const allowInsecureTls =
    env.MONGODB_TLS_INSECURE === "true" || process.env.NODE_ENV === "development";

  if (!allowInsecureTls) {
    return {};
  }

  return {
    tlsAllowInvalidCertificates: true,
  };
}

async function testConnection() {
  const env = loadEnv();
  const uri = env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI not found in .env file");
  }

  const options = getClientOptions(env);
  const client = new MongoClient(uri, options);

  console.log("Connecting to MongoDB Atlas...");
  if (options.tlsAllowInvalidCertificates) {
    console.log("Using local TLS workaround (MONGODB_TLS_INSECURE=true)");
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const { databases } = await client.db().admin().listDatabases();
    const names = databases.map((db) => db.name).join(", ");

    console.log("SUCCESS: Database connected!");
    console.log("Available databases:", names);
  } catch (error) {
    console.error("FAILED: Could not connect to database.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

testConnection();

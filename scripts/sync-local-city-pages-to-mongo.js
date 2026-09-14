const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

function replaceFluentAuf(obj) {
  if (typeof obj === "string") {
    return obj.replace(/Fluent AUF/g, "German Skill");
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceFluentAuf);
  }
  if (obj && typeof obj === "object") {
    const res = {};
    for (const key of Object.keys(obj)) {
      res[key] = replaceFluentAuf(obj[key]);
    }
    return res;
  }
  return obj;
}

(async () => {
  const storePath = path.join(process.cwd(), "data", "city-pages-store.json");
  const rawData = fs.readFileSync(storePath, "utf8");
  let store = JSON.parse(rawData.charCodeAt(0) === 0xfeff ? rawData.slice(1) : rawData);

  // Replace Fluent AUF with German Skill across city pages data
  store = replaceFluentAuf(store);

  // Write updated data back to local file
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
  console.log("Local city-pages-store.json updated (Fluent AUF replaced with German Skill).");

  let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : "";
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  if (uri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(uri)) {
    uri += `${uri.includes("?") ? "&" : "?"}ssl=true&retryWrites=true&w=majority`;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 20000,
    family: 4,
    tlsAllowInvalidCertificates: true,
  });

  await client.connect();
  const collection = client.db("germanskill").collection("city_pages");

  const document = {
    _id: "site_city_pages",
    ...store,
    updatedAt: new Date(),
  };

  await collection.updateOne({ _id: "site_city_pages" }, { $set: document }, { upsert: true });
  console.log("MongoDB city_pages collection updated successfully with latest data!");

  const doc = await collection.findOne({ _id: "site_city_pages" });
  console.log("Verified Mongo stored pages count:", doc?.pages?.length);
  if (doc?.pages) {
    doc.pages.forEach((p) => console.log(`- ${p.cityName} (slug: ${p.slug})`));
  }

  await client.close();
})().catch((error) => {
  console.error("Error syncing city pages:", error.message || error);
  process.exit(1);
});

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

(async () => {
  const storePath = path.join(process.cwd(), "data", "course-details-store.json");
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  const docs = Object.values(store);

  let uri = process.env.MONGODB_URI.trim();
  if (uri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(uri)) {
    uri += `${uri.includes("?") ? "&" : "?"}ssl=true&retryWrites=true&w=majority`;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 20000,
    family: 4,
    tlsAllowInvalidCertificates: true,
  });
  await client.connect();
  const collection = client.db("germanskill").collection("course_details");

  for (const doc of docs) {
    if (!doc?.slug) continue;
    const payload = {
      ...doc,
      updatedAt: new Date(),
    };
    delete payload._id;

    await collection.updateOne({ slug: doc.slug }, { $set: payload }, { upsert: true });
    console.log(
      "synced",
      doc.slug,
      "| batch=",
      doc.course?.batchSize,
      "| hours=",
      doc.course?.learningHours || doc.course?.hours,
      "| price=",
      doc.course?.price,
    );
  }

  const count = await collection.countDocuments();
  console.log("done. mongo course_details count =", count);
  await client.close();
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

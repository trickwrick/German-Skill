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
  const strike = "₹26,000";
  const storePath = path.join(process.cwd(), "data", "course-details-store.json");
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  if (store.b1) {
    store.b1.course = store.b1.course || {};
    store.b1.course.originalPrice = strike;
    store.b1.flexibleBatches = store.b1.flexibleBatches || {};
    store.b1.flexibleBatches.originalPrice = strike;
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
    console.log("local b1 strike", strike);
  }

  let uri = process.env.MONGODB_URI.trim();
  if (uri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(uri)) {
    uri += `${uri.includes("?") ? "&" : "?"}ssl=true&retryWrites=true&w=majority`;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4,
    tlsAllowInvalidCertificates: true,
  });
  await client.connect();
  await client.db("germanskill").collection("course_details").updateOne(
    { slug: "b1" },
    {
      $set: {
        "course.originalPrice": strike,
        "flexibleBatches.originalPrice": strike,
        updatedAt: new Date(),
      },
    },
  );
  console.log("mongo b1 strike", strike);
  await client.close();
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

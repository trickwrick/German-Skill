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
  const docs = await client
    .db("germanskill")
    .collection("course_details")
    .find({})
    .project({
      slug: 1,
      "course.title": 1,
      "course.batchSize": 1,
      updatedAt: 1,
    })
    .toArray();

  docs.sort((a, b) => String(a.slug).localeCompare(String(b.slug)));
  console.log("Mongo Online Batch Size (course.batchSize):\n");
  for (const doc of docs) {
    console.log(
      `${doc.slug} | ${doc.course?.title || "(no title)"} | batchSize=${doc.course?.batchSize ?? "(MISSING)"} | updated=${doc.updatedAt || "(none)"}`,
    );
  }
  await client.close();
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

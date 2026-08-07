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
      "course.price": 1,
      "course.image": 1,
      "course.pathName": 1,
      "course.description": 1,
      "course.hours": 1,
      "course.originalPrice": 1,
    })
    .toArray();

  console.log("COUNT", docs.length);
  for (const doc of docs) {
    console.log("---", doc.slug);
    console.log(JSON.stringify(doc.course || {}, null, 2));
  }
  await client.close();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

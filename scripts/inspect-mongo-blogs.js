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
  const db = client.db("germanskill");
  const deleted = await db.collection("admin_settings").findOne({ _id: "blog_deleted_slugs" });
  const posts = await db.collection("blog_posts").find({}).project({ slug: 1, title: 1 }).toArray();
  const deletedSet = new Set((deleted?.slugs || []).map(String));

  console.log("DELETED_SLUGS");
  for (const slug of deleted?.slugs || []) console.log("-", slug);
  console.log("--- POSTS ---");
  for (const post of posts) {
    console.log(deletedSet.has(post.slug) ? "HIDDEN" : "OK   ", post.slug);
  }
  await client.close();
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

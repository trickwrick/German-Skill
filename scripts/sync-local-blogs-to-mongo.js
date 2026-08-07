const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("NO_MONGODB_URI");
    process.exit(1);
  }

  const opts = {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    family: 4,
    tlsAllowInvalidCertificates: true,
  };

  let connectionUri = uri.trim();
  if (connectionUri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(connectionUri)) {
    connectionUri += `${connectionUri.includes("?") ? "&" : "?"}ssl=true&retryWrites=true&w=majority`;
  }

  const client = new MongoClient(connectionUri, opts);
  await client.connect();
  const db = client.db("germanskill");
  const collection = db.collection("blog_posts");

  const posts = await collection.find({}).project({ slug: 1, title: 1 }).toArray();
  const deleted = await db.collection("admin_settings").findOne({ _id: "blog_deleted_slugs" });

  console.log("MONGO_POST_COUNT", posts.length);
  console.log("MONGO_SLUGS", posts.map((p) => p.slug).join(", ") || "(none)");
  console.log("DELETED_COUNT", (deleted?.slugs || []).length);
  console.log(
    "DELETED_HAS_NEW",
    (deleted?.slugs || []).includes("7-days-week-names-in-german"),
  );

  const store = JSON.parse(
    fs.readFileSync(path.join("data", "blog-store.json"), "utf8"),
  );
  console.log("LOCAL_POST_COUNT", (store.posts || []).length);

  for (const post of store.posts || []) {
    const doc = { ...post };
    delete doc._id;
    await collection.updateOne(
      { slug: post.slug },
      {
        $set: {
          ...doc,
          updatedAt: new Date(),
          createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
        },
      },
      { upsert: true },
    );
    console.log("UPSERTED", post.slug);
  }

  const slugs = (store.posts || []).map((p) => p.slug).filter(Boolean);
  if (slugs.length) {
    await db.collection("admin_settings").updateOne(
      { _id: "blog_deleted_slugs" },
      { $pull: { slugs: { $in: slugs } } },
    );
  }

  console.log("MONGO_POST_COUNT_AFTER", await collection.countDocuments());
  await client.close();
})().catch((error) => {
  console.error("ERR", error.message);
  process.exit(1);
});

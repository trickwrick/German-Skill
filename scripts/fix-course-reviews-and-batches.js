const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

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

// 1. Update data/course-details-store.json
const jsonPath = path.join(process.cwd(), "data", "course-details-store.json");
if (fs.existsSync(jsonPath)) {
  let jsonStore = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  jsonStore = replaceFluentAuf(jsonStore);
  for (const slug of Object.keys(jsonStore)) {
    if (jsonStore[slug]?.course) {
      jsonStore[slug].course.batchSize = "5-6 Students";
    }
  }
  fs.writeFileSync(jsonPath, JSON.stringify(jsonStore, null, 2), "utf8");
  console.log("Updated data/course-details-store.json");
}

// 2. Update data/germanA1Content.ts
const a1ContentPath = path.join(process.cwd(), "data", "germanA1Content.ts");
if (fs.existsSync(a1ContentPath)) {
  let content = fs.readFileSync(a1ContentPath, "utf8");
  content = content.replace(/Fluent AUF/g, "German Skill");
  fs.writeFileSync(a1ContentPath, content, "utf8");
  console.log("Updated data/germanA1Content.ts");
}

// 3. Sync to MongoDB course_details collection
(async () => {
  let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : "";
  if (!uri) return;
  if (uri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(uri)) {
    uri += `${uri.includes("?") ? "&" : "?"}ssl=true&retryWrites=true&w=majority`;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 20000,
    family: 4,
    tlsAllowInvalidCertificates: true,
  });

  await client.connect();
  const col = client.db("germanskill").collection("course_details");
  const docs = await col.find({}).toArray();

  for (let doc of docs) {
    doc = replaceFluentAuf(doc);
    if (doc.course) {
      doc.course.batchSize = "5-6 Students";
    }
    const { _id, ...updateData } = doc;
    await col.updateOne({ _id }, { $set: updateData });
    console.log("Updated Mongo course doc:", doc.slug);
  }

  await client.close();
  console.log("MongoDB course_details updated successfully!");
})().catch((err) => {
  console.error("Mongo error:", err.message);
});

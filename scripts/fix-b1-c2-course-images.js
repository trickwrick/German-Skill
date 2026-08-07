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

const IMAGE_BY_SLUG = {
  b1: "/api/course-images/german-b1-1781605756747.jpg",
  b2: "/api/course-images/german-b2-1781605787250.jpg",
  c1: "/api/course-images/german-c1-1781605811162.jpg",
  c2: "/api/course-images/german-c2-1781605834210.jpg",
};

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

  for (const [slug, image] of Object.entries(IMAGE_BY_SLUG)) {
    const filename = image.split("/").pop();
    const fileDoc = await db.collection("course_images").findOne(
      { filename },
      { projection: { filename: 1 } },
    );
    console.log(slug, filename, fileDoc ? "FILE_OK" : "FILE_MISSING");

    const result = await db.collection("course_details").updateOne(
      { slug },
      { $set: { "course.image": image } },
    );
    console.log(slug, "details modified", result.modifiedCount);
  }

  await client.close();
  console.log("DONE");
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

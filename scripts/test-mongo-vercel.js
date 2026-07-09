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
    vars[trimmed.slice(0, separator).trim()] = trimmed.slice(separator + 1).trim();
  }

  return vars;
}

async function test(label, envOverrides) {
  Object.assign(process.env, envOverrides);
  delete require.cache[require.resolve("../lib/mongodb.ts")];
  const { getMongoClient, resetMongoClient } = await import("../lib/mongodb.ts");
  resetMongoClient();

  try {
    const client = await getMongoClient();
    await client.db("germanskill").collection("blog_posts").updateOne(
      { slug: "test-live-save-check" },
      {
        $set: {
          slug: "test-live-save-check",
          title: "Test",
          date: "2026-06-13",
          author: "Fluent AUF Team",
          excerpt: "test",
          image: "/portal-education.jpg",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
    console.log(`${label}: OK`);
  } catch (error) {
    console.error(`${label}: FAIL`);
    console.error(error instanceof Error ? error.message : error);
  } finally {
    resetMongoClient();
  }
}

async function main() {
  const env = loadEnv();
  process.env.MONGODB_URI = env.MONGODB_URI;

  await test("vercel without TLS insecure", {
    NODE_ENV: "production",
    VERCEL: "1",
  });
  delete process.env.MONGODB_TLS_INSECURE;

  await test("vercel with TLS insecure", {
    NODE_ENV: "production",
    VERCEL: "1",
    MONGODB_TLS_INSECURE: "true",
  });
}

main();

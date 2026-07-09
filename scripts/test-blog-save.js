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

async function main() {
  const env = loadEnv();
  process.env.MONGODB_URI = env.MONGODB_URI;
  process.env.NODE_ENV = "production";
  process.env.VERCEL = "1";
  delete process.env.MONGODB_TLS_INSECURE;

  const { saveBlogPost } = await import("../lib/blogStore.ts");

  try {
    const saved = await saveBlogPost({
      slug: "test-live-save-check",
      title: "Test Live Save",
      date: "2026-06-13",
      author: "Fluent AUF Team",
      excerpt: "test",
      image: "/portal-education.jpg",
      content: "<p>test</p>",
      seo: {
        metaTitle: "Test",
        metaKeyword: "test",
        metaDescription: "test",
        otherMeta: "",
      },
      tags: ["test"],
      categories: ["General"],
      faqs: [],
    });
    console.log("SAVE OK", saved.slug);
  } catch (error) {
    console.error("SAVE FAIL");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

main();

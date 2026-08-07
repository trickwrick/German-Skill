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

/** Snapshot of Mongo course cards + review prices from before the local->Mongo sync. */
const BEFORE_SYNC = {
  a1: {
    course: {
      pathName: "german-a1",
      title: "German A1 Level : For Beginners!",
      description:
        "Learn German Language From A Native and Experienced German Teacher - Learn German Grammar, Vocabulary and Speaking from scratch.",
      hours: "111 Hours +",
      learningHours: "111 Hours",
      price: "₹11,999.00",
      image: "/courses/german-a1-1781517209979.png",
      batchSize: "20-40 Students",
      enrolled: "112",
      rating: "4.50",
      reviewCount: "37",
    },
    flexOriginal: "₹22,998",
  },
  a2: {
    course: {
      pathName: "german-a2",
      title: "German A2 Level : Elementary",
      description:
        "Learn The German Grammar From A Native and Experienced German Teacher - Learn German Grammar For Advanced Beginners.",
      hours: "115 Hours +",
      learningHours: "115 Hours",
      price: "₹17,500.00",
      image: "/courses/german-a2-1781517189489.png",
      batchSize: "20-40 Students",
      enrolled: "98",
      rating: "4.50",
      reviewCount: "29",
    },
    flexOriginal: "₹17,999",
  },
  b1: {
    course: {
      pathName: "german-b1",
      title: "German B1 Level : Intermediate",
      description:
        "German Language has taken immense importance in contemporary business. It should be learnt properly with structured modules.",
      hours: "130 Hours +",
      learningHours: "130 Hours",
      price: "₹21,000.00",
      image: "/api/course-images/german-b1-1781605756747.jpg",
      batchSize: "20-40 Students",
      enrolled: "86",
      rating: "4.50",
      reviewCount: "24",
    },
    flexOriginal: "₹26,000",
  },
  b2: {
    course: {
      pathName: "german-b2",
      title: "German B2 Level : Upper Intermediate",
      description:
        "Learn German Language From A Native & Experienced German Teacher - Learn German Grammar, Vocabulary and fluency skills.",
      hours: "51 Hours +",
      learningHours: "51 Hours",
      price: "₹21,000.00",
      image: "/api/course-images/german-b2-1781605787250.jpg",
      batchSize: "15-30 Students",
      enrolled: "64",
      rating: "4.50",
      reviewCount: "18",
    },
    flexOriginal: "₹26,000",
  },
  c1: {
    course: {
      pathName: "german-c1",
      title: "German C1 Level : Advance Level German",
      description:
        "The German Language C1 level, also known as the Advanced Level, represents a significant milestone in language mastery.",
      hours: "60 Hours +",
      learningHours: "60 Hours",
      price: "₹20,500.00",
      image: "/api/course-images/german-c1-1781605811162.jpg",
      batchSize: "15-25 Students",
      enrolled: "42",
      rating: "4.50",
      reviewCount: "15",
    },
    flexOriginal: "₹27,000",
  },
  c2: {
    course: {
      pathName: "german-c2",
      title: "German C2 Level : Highly Competent Level German",
      description:
        "The German Language C2 level, also known as the Highly Competent Level, represents the pinnacle of mastery in German.",
      hours: "60 Hours +",
      learningHours: "60 Hours",
      price: "₹23,500.00",
      image: "/api/course-images/german-c2-1781605834210.jpg",
      batchSize: "10-20 Students",
      enrolled: "28",
      rating: "4.50",
      reviewCount: "12",
    },
    flexOriginal: "₹30,000",
  },
  "german-course-beginner-to-advanced-level": {
    course: {
      pathName: "german-course-beginner-to-advanced-level",
      title: "German A1 to B2 Complete Course",
      description:
        "Join our German Complete Course from A1 to B2. Learn grammar, vocabulary, conversation, and exam-focused skills with experienced instructors.",
      hours: "9 Months",
      learningHours: "9 Months",
      price: "₹53,999.00",
      image: "/api/course-images/german-german-a1-to-b2-all-in-one-1782388845004.jpg",
      batchSize: "5-6 Students",
      enrolled: "578",
      rating: "4.60",
      reviewCount: "178",
      originalPrice: "₹73,499",
    },
    flexOriginal: "₹73,499",
  },
};

(async () => {
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

  for (const [slug, snapshot] of Object.entries(BEFORE_SYNC)) {
    const course = { slug, ...snapshot.course };
    await collection.updateOne(
      { slug },
      {
        $set: {
          slug,
          course,
          "flexibleBatches.originalPrice": snapshot.flexOriginal,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    console.log("restored", slug, course.price, course.image, "orig", snapshot.flexOriginal);
  }

  await client.close();
  console.log("done");
})().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

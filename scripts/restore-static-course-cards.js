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

const STATIC_COURSES = [
  {
    slug: "a1",
    pathName: "german-a1",
    title: "German A1 Level : For Beginners!",
    description:
      "Learn German Language From A Native and Experienced German Teacher - Learn German Grammar, Vocabulary and Speaking from scratch.",
    hours: "111 Hours +",
    price: "₹11,999.00",
    image: "/courses/german-a1-1781517209979.png",
    batchSize: "20-40 Students",
    enrolled: "112",
    rating: "4.50",
    reviewCount: "37",
    learningHours: "111 Hours",
  },
  {
    slug: "a2",
    pathName: "german-a2",
    title: "German A2 Level : Elementary",
    description:
      "Learn The German Grammar From A Native and Experienced German Teacher - Learn German Grammar For Advanced Beginners.",
    hours: "115 Hours +",
    price: "₹17,500.00",
    image: "/courses/german-a2-1781517189489.png",
    batchSize: "20-40 Students",
    enrolled: "98",
    rating: "4.50",
    reviewCount: "29",
    learningHours: "115 Hours",
  },
  {
    slug: "b1",
    pathName: "german-b1",
    title: "German B1 Level : Intermediate",
    description:
      "German Language has taken immense importance in contemporary business. It should be learnt properly with structured modules.",
    hours: "130 Hours +",
    price: "₹21,000.00",
    image: "/webinar-student.jpg",
    batchSize: "20-40 Students",
    enrolled: "86",
    rating: "4.50",
    reviewCount: "24",
    learningHours: "130 Hours",
  },
  {
    slug: "b2",
    pathName: "german-b2",
    title: "German B2 Level : Upper Intermediate",
    description:
      "Learn German Language From A Native & Experienced German Teacher - Learn German Grammar, Vocabulary and fluency skills.",
    hours: "51 Hours +",
    price: "₹21,000.00",
    image: "/hero-students.jpg",
    batchSize: "15-30 Students",
    enrolled: "64",
    rating: "4.50",
    reviewCount: "18",
    learningHours: "51 Hours",
  },
  {
    slug: "c1",
    pathName: "german-c1",
    title: "German C1 Level : Advance Level German",
    description:
      "The German Language C1 level, also known as the Advanced Level, represents a significant milestone in language mastery.",
    hours: "60 Hours +",
    price: "₹20,500.00",
    image: "/portal-education.jpg",
    batchSize: "15-25 Students",
    enrolled: "42",
    rating: "4.50",
    reviewCount: "15",
    learningHours: "60 Hours",
  },
  {
    slug: "c2",
    pathName: "german-c2",
    title: "German C2 Level : Highly Competent Level German",
    description:
      "The German Language C2 level, also known as the Highly Competent Level, represents the pinnacle of mastery in German.",
    hours: "60 Hours +",
    price: "₹23,500.00",
    image: "/webinar-student.jpg",
    batchSize: "10-20 Students",
    enrolled: "28",
    rating: "4.50",
    reviewCount: "12",
    learningHours: "60 Hours",
  },
];

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
  const collection = client.db("germanskill").collection("course_details");

  for (const course of STATIC_COURSES) {
    const result = await collection.updateOne(
      { slug: course.slug },
      {
        $set: {
          "course.slug": course.slug,
          "course.pathName": course.pathName,
          "course.title": course.title,
          "course.description": course.description,
          "course.hours": course.hours,
          "course.price": course.price,
          "course.image": course.image,
          "course.batchSize": course.batchSize,
          "course.enrolled": course.enrolled,
          "course.rating": course.rating,
          "course.reviewCount": course.reviewCount,
          "course.learningHours": course.learningHours,
        },
        $unset: {
          "course.originalPrice": "",
        },
      },
    );
    console.log(
      course.slug,
      "matched",
      result.matchedCount,
      "modified",
      result.modifiedCount,
    );
  }

  await client.close();
  console.log("DONE restore A1-C2 card fields to static defaults");
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

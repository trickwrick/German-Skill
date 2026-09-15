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

// Exact Jaipur page data entered via Admin panel with 6 FAQs
const jaipurPage = {
  slug: "jaipur",
  cityName: "Jaipur",
  title: "German Classes in Jaipur",
  subtitle: "Build Confidence in",
  heroTypedPhrases: [
    "German Communication",
    "German Classes",
    "German Best learn"
  ],
  heroDescription: "Professional German Goethe & TELC learning assistance from A1 to C2 — prepare for study abroad, stronger careers, and Germany / Austria / Switzerland pathways with live expert-led classes.",
  highlights: [
    {
      title: "Live Online Classes",
      text: "Join interactive German batches from Jaipur with real-time speaking practice."
    },
    {
      title: "A1 to C2 Levels",
      text: "Structured CEFR courses for beginners through advanced learners."
    },
    {
      title: "Exam Preparation",
      text: "Goethe, telc and TestDaF focused practice with mock tests."
    },
    {
      title: "Flexible Batches",
      text: "Weekday and weekend timings that fit your schedule."
    }
  ],
  contentHtml: "<p>Fluent AUF helps learners in <strong>Jaipur</strong> build German fluency for study abroad, careers, migration, and personal growth.</p>\n<p>Our certified trainers guide you through grammar, vocabulary, conversation, and exam skills with small interactive batches.</p>\n<h3>Why choose Fluent AUF in Jaipur?</h3>\n<ul><li>Live online classes you can attend from home</li><li>Personalized attention and doubt support</li><li>Study material and session recordings</li><li>Free demo class before you enroll</li></ul>",
  vision: {
    tag: "Our Vision",
    heading: "Empowering German learners in",
    headingHighlight: "Jaipur",
    headingSuffix: "and beyond",
    text: "At Fluent AUF, our vision is to help learners in Jaipur and across India achieve real German fluency — not just textbook knowledge, but the confidence to communicate in exams, interviews, and everyday life abroad.",
    points: [
      "Make quality German education accessible to learners in every city through live online classes.",
      "Build exam-ready fluency with Goethe and TELC focused training from A1 to C2.",
      "Help students gain confidence to study, work, and settle abroad with practical language skills."
    ],
    imageSrc: "/hero-students.jpg",
    imageAlt: "Fluent AUF German language learners from Jaipur",
    badgeValue: "16,000+",
    badgeLabel: "Students learning with us",
    linkText: "Learn more about Fluent AUF",
    linkHref: "/about/our-company"
  },
  whyLearn: {
    headingBefore: "Why Learn at",
    headingHighlight: "Fluent AUF",
    headingAfter: "?",
    text: "Build real German fluency with live classes, certified tutors, and exam-focused guidance — trusted by learners in Jaipur and across India.",
    collage: [
      {
        src: "/portal-education.jpg",
        alt: "Live German classroom session",
        label: "Live Classroom Sessions"
      },
      {
        src: "/webinar-student.jpg",
        alt: "Student learning German online",
        label: "Interactive Online Classes"
      },
      {
        src: "/hero-students.jpg",
        alt: "Students preparing for German exams",
        label: "Goethe & TELC Preparation"
      }
    ],
    features: [
      {
        title: "Free Demo Classes",
        text: "Experience our teaching style before you enroll. Sit in a live session and decide with confidence.",
        badge: "100% Free",
        tone: "demo"
      },
      {
        title: "Exam-Focused Training",
        text: "Structured A1–C2 prep aligned with Goethe and TELC patterns, practice tests, and speaking drills.",
        badge: "Exam Ready",
        tone: "exam"
      },
      {
        title: "Certified German Tutors",
        text: "Learn from experienced, certified trainers who guide you with clear feedback every step of the way.",
        badge: "Expert Faculty",
        tone: "tutors"
      },
      {
        title: "Flexible Online Batches",
        text: "Join weekday or weekend batches from Jaipur or anywhere — small groups, live classes, recorded support.",
        badge: "Live Online",
        tone: "batch"
      }
    ]
  },
  journey: {
    text: "Achieve German language expertise from our German classes in Jaipur, as we design courses that make your German learning journey easy and productive. Whether you are planning to learn German for better career or academic opportunities on a global scale, learn a new language as a hobby, or want to achieve immigration goals, we are here to train you with all the practical methods that can help you achieve fluency in the language. No matter what your learning goal is, we are here to help you learn a new language from beginner to advanced level. Browse through our courses and select the one that aligns with your learning goals now!",
    buttonText: "Start Your Journey Now",
    buttonHref: "/contact"
  },
  success: {
    badge: "Goethe & TELC Focused",
    kicker: "Learn German at Fluent AUF & Unlock Your",
    heading: "Dream Opportunity",
    headingHighlight: "Abroad",
    text: "Join 10,500+ successful students who built German fluency for study, work, and career growth — including learners.",
    buttonText: "Enquire Now",
    buttonHref: "/contact",
    imageSrc: "/hero-students.jpg",
    imageAlt: "Successful German learners from Jaipur"
  },
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Get answers to the most common questions about our German courses and learning process.",
    items: [
      {
        id: "german-levels",
        question: "What levels of German do you offer?",
        answer: "Fluent AUF offers structured German courses from A1 to C2, including Goethe and Telc exam preparation for every level."
      },
      {
        id: "course-duration",
        question: "How long does it take to complete a course?",
        answer: "Course duration depends on the level. A1 typically takes 8–12 weeks, while higher levels may take longer with regular live classes and practice."
      },
      {
        id: "certificates",
        question: "Do you provide certificates upon completion?",
        answer: "Yes. Students receive a course completion certificate from Fluent AUF, and we also prepare you for official Goethe and Telc certifications."
      },
      {
        id: "demo-class",
        question: "Can I attend a free demo class?",
        answer: "Yes. You can book a free demo class to experience our teaching style, meet a trainer, and get level guidance before enrolling."
      },
      {
        id: "refund-policy",
        question: "What is your refund policy?",
        answer: "Refund terms depend on the course, batch start date, and classes attended. Contact our admissions team for details before enrolling."
      },
      {
        id: "one-on-one",
        question: "Do you offer one-on-one classes?",
        answer: "Yes. We offer one-on-one German coaching for learners who need flexible timings or focused exam preparation."
      }
    ]
  },
  ctaHeading: "Start learning German from Jaipur",
  ctaText: "Achieve German language expertise from our German classes in Jaipur, as we design courses that make your German learning journey easy and productive. Whether you are planning to learn German for better career or academic opportunities on a global scale, learn a new language as a hobby, or want to achieve immigration goals, we are here to train you with all the practical methods that can help you achieve fluency in the language. No matter what your learning goal is, we are here to help you learn a new language from beginner to advanced level. Browse through our courses and select the one that aligns with your learning goals now!",
  ctaButtonText: "Start Your Journey Now",
  seo: {
    metaTitle: "German Classes in Jaipur | Fluent AUF",
    metaKeyword: "German classes in Jaipur, learn German Jaipur, Goethe exam Jaipur",
    metaDescription: "Learn German online with Fluent AUF — live A1 to C2 classes for students in Jaipur. Book a free demo today."
  },
  isActive: true,
  sortOrder: 2
};

(async () => {
  const storePath = path.join(process.cwd(), "data", "city-pages-store.json");
  const rawData = fs.readFileSync(storePath, "utf8");
  const store = JSON.parse(rawData.charCodeAt(0) === 0xfeff ? rawData.slice(1) : rawData);

  // Replace Jaipur page in store with exact Admin version
  const existingIdx = store.pages.findIndex(p => p.slug === "jaipur");
  if (existingIdx >= 0) {
    store.pages[existingIdx] = jaipurPage;
  } else {
    store.pages.push(jaipurPage);
  }

  // Write to local JSON file
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
  console.log("Local city-pages-store.json restored with 6 FAQs Jaipur admin data!");

  // Save to MongoDB
  let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : "";
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  if (uri.startsWith("mongodb://") && !/[?&]ssl=true/i.test(uri)) {
    uri += `${uri.includes("?") ? "&" : "?"}ssl=true&retryWrites=true&w=majority`;
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 20000,
    family: 4,
    tlsAllowInvalidCertificates: true,
  });

  await client.connect();
  const collection = client.db("germanskill").collection("city_pages");

  const document = {
    _id: "site_city_pages",
    ...store,
    updatedAt: new Date(),
  };

  await collection.updateOne({ _id: "site_city_pages" }, { $set: document }, { upsert: true });
  console.log("MongoDB city_pages updated with 6 FAQs Jaipur admin data successfully!");

  const doc = await collection.findOne({ _id: "site_city_pages" });
  const mongoJaipur = doc?.pages?.find(p => p.slug === "jaipur");
  console.log("Verified Mongo Jaipur FAQs count:", mongoJaipur?.faqs?.items?.length);

  await client.close();
})().catch((error) => {
  console.error("Error restoring admin city pages:", error.message || error);
  process.exit(1);
});

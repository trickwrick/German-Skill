export type GeneralPageId =
  | "terms"
  | "privacy"
  | "refund"
  | "our-company"
  | "apply-job"
  | "german-language-course";

export type PageSeoMeta = {
  metaTitle: string;
  metaKeyword: string;
  metaDescription: string;
};

export type LegalPageContentData = {
  html: string;
  /** @deprecated Use html instead */
  paragraphs?: string[];
  /** Optional SEO meta tags (used by Apply Job) */
  seo?: PageSeoMeta;
};

/** SEO + banner content for the public courses listing page */
export type GermanLanguageCoursePageData = {
  pageTitle: string;
  pageDescription: string;
  seo: PageSeoMeta;
};

export type OurCompanyStat = {
  value: string;
  label: string;
};

export type OurCompanyFeature = {
  title: string;
  text: string;
};

export type OurCompanyValue = {
  title: string;
  text: string;
};

export type OurCompanyFacultyMember = {
  name: string;
  image: string;
  role: string;
};

export type OurCompanyPageData = {
  intro: {
    tag: string;
    heading: string;
    headingHighlight: string;
    headingSuffix: string;
    description: string;
    listItems: string[];
    primaryButtonText: string;
    secondaryButtonText: string;
    imageSrc: string;
    imageAlt: string;
    badgeValue: string;
    badgeLabel: string;
  };
  stats: OurCompanyStat[];
  features: {
    tag: string;
    heading: string;
    description: string;
    items: OurCompanyFeature[];
  };
  values: {
    tag: string;
    heading: string;
    items: OurCompanyValue[];
  };
  faculty: {
    tag: string;
    heading: string;
    description: string;
    members: OurCompanyFacultyMember[];
  };
  cta: {
    heading: string;
    description: string;
    buttonText: string;
  };
};

export type GeneralPagesContent = {
  terms: LegalPageContentData;
  privacy: LegalPageContentData;
  refund: LegalPageContentData;
  ourCompany: OurCompanyPageData;
  applyJob: LegalPageContentData;
  germanLanguageCourse: GermanLanguageCoursePageData;
};

export const generalPageOptions: Array<{ id: GeneralPageId; label: string }> = [
  { id: "terms", label: "Terms & Conditions" },
  { id: "privacy", label: "Privacy Policy" },
  { id: "refund", label: "Refund Policy" },
  { id: "our-company", label: "Our Company" },
  { id: "apply-job", label: "Apply Job" },
  { id: "german-language-course", label: "German Language Course" },
];

import { legalParagraphsToHtml } from "../lib/generalPageUtils";

export const defaultTermsContent: LegalPageContentData = {
  html: legalParagraphsToHtml([
    "By enrolling in Fluent AUF courses or using our website, you agree to follow our class schedules, payment terms, and communication guidelines.",
    "Course access, batch timings, and study material are provided as per the selected program. Students are expected to attend live sessions regularly and maintain respectful conduct during classes.",
    "Fluent AUF may update course content, faculty assignments, or batch schedules when required for academic quality or operational reasons.",
    "For questions about these terms, contact us at fluentauf@gmail.com or +91 88269 67151.",
  ]),
};

export const defaultPrivacyContent: LegalPageContentData = {
  html: legalParagraphsToHtml([
    "Fluent AUF collects information such as your name, email address, phone number, and course preferences when you submit enquiry or enrollment forms.",
    "We use this information to contact you about classes, batches, demos, and support related to your German learning journey.",
    "Your details are not sold to third parties. Information may be shared only with trusted service providers required to operate our website, communication tools, or payment systems.",
    "You may request correction or deletion of your contact details by writing to fluentauf@gmail.com.",
  ]),
};

export const defaultRefundContent: LegalPageContentData = {
  html: legalParagraphsToHtml([
    "Refund eligibility depends on the course selected, batch start date, and number of classes attended.",
    "If you need to cancel enrollment, please contact our team before the batch begins for the best available resolution.",
    "Approved refunds, when applicable, are processed to the original payment method within the timelines shared by our admissions team.",
    "For refund-related questions, email fluentauf@gmail.com or call +91 88269 67151 before enrolling.",
  ]),
};

export const defaultOurCompanyContent: OurCompanyPageData = {
  intro: {
    tag: "Est. 2013",
    heading: "Building German fluency for",
    headingHighlight: "10,500+ learners",
    headingSuffix: "across India",
    description:
      "Fluent AUF is a dedicated German language institute helping students, professionals, and aspirants achieve certification and confidence for study, work, and life in Germany.",
    listItems: [
      "A1 to C2 structured programs with certified trainers",
      "Goethe & telc exam preparation with mock tests",
      "Online batches with flexible timings",
    ],
    primaryButtonText: "Explore Courses",
    secondaryButtonText: "Talk to Us",
    imageSrc: "/hero-students.jpg",
    imageAlt: "Fluent AUF students in a learning session",
    badgeValue: "13+",
    badgeLabel: "Years of trust",
  },
  stats: [
    { value: "10,500+", label: "Happy Students" },
    { value: "2,100+", label: "Batches Completed" },
    { value: "21+", label: "Certified Trainers" },
    { value: "85%", label: "Exam Success Rate" },
  ],
  features: {
    tag: "Our Edge",
    heading: "Why learners choose Fluent AUF",
    description:
      "A professional institute built around results — not just syllabus completion, but real language ability and exam readiness.",
    items: [
      {
        title: "Certified Faculty",
        text: "Goethe-trained instructors with real classroom experience across A1 to C2 levels.",
      },
      {
        title: "Exam-Focused Curriculum",
        text: "Structured programs aligned with Goethe and telc patterns — grammar, speaking, and mocks.",
      },
      {
        title: "Flexible Learning",
        text: "Online, morning, and weekend batches designed for students and professionals.",
      },
      {
        title: "Student Support",
        text: "Doubt sessions, progress tracking, and counsellor guidance from demo class to certification.",
      },
    ],
  },
  values: {
    tag: "What we stand for",
    heading: "Our Core Values",
    items: [
      {
        title: "Commitment",
        text: "Every learner gets focused attention from enrollment through exam results.",
      },
      {
        title: "Integrity",
        text: "Transparent fees, honest guidance, and quality teaching — no shortcuts.",
      },
      {
        title: "Excellence",
        text: "We continuously improve batches, materials, and methods to raise outcomes.",
      },
    ],
  },
  faculty: {
    tag: "Faculty Team",
    heading: "Meet our German trainers",
    description:
      "Certified mentors who guide you through grammar, speaking, writing, and exam strategy — in live classes and focused doubt sessions.",
    members: [
      {
        name: "Khushi Sharma",
        image: "/tutors/khushi-sharma.jpg",
        role: "Certified German Trainer",
      },
      {
        name: "Preeti Sharma",
        image: "/tutors/preeti-sharma.jpg",
        role: "Certified German Trainer",
      },
    ],
  },
  cta: {
    heading: "Ready to start your German journey?",
    description:
      "Book a free demo class and experience our teaching approach before you enroll. No pressure — just clarity on the right level and batch for you.",
    buttonText: "Book Free Demo",
  },
};

export const defaultApplyJobContent: LegalPageContentData = {
  html: [
    "<p>Do you love inspiring students by helping them learn German and reach their linguistic targets? Then we are looking for highly committed, experienced, and passionate teachers. Are you looking for german tutor jobs online? You have found the best place. We give you a chance to inspire our motivated learners, develop professionally, and leave a positive imprint via quality education provided online.</p>",
    "<p>No matter if you are a seasoned teacher or simply a certified expert in the field of German language, you will become an important member of our supportive family which values innovation, flexibility, and academic success of our tutors.</p>",
    "<h4>Why Should You Work With Us?</h4>",
    "<p>We are convinced that great teachers foster great learners. That is why we are able to provide such a unique atmosphere that tutors can concentrate on their teaching, and we will be there with all the required academic support and continuous influx of students.</p>",
    "<p>If you are interested in finding german tutor jobs work from home, our online system will help you teach from home without breaking your professional plans.</p>",
    "<h4>Educate Students Around the Globe</h4>",
    "<p>Our students hail from various nations and have diverse backgrounds. While some of them may be learning German in order to pursue higher education, some may need the language for work purposes, moving to another country, traveling, and even self-improvement.</p>",
    "<p>If you have been working as a German language teacher online before, then you will educate students of different levels—from absolute beginner level to advanced level who need to pass internationally acknowledged German language tests. Every class will contribute towards improving your students' confidence.</p>",
    "<h4>Be Your Student's Language Coach</h4>",
    "<p>In addition to teaching the basic concepts of grammar and vocabulary, as a german language coach, you will encourage your students, make them more confident, and lead them on the path of learning according to their requirements.</p>",
    "<h4>Flexible Online Teaching Opportunities</h4>",
    "<p>We constantly increase the teaching faculty and recruit outstanding talent for remote german teacher jobs. Regardless of whether you are looking for a career or need some extra cash, our flexible model will make it possible for you to teach from any location that has access to stable Internet connectivity.</p>",
    "<p>As our student base increases, we often have german teacher vacancies for dedicated individuals who want to establish a successful career in teaching online.</p>",
    "<p>If you want to be flexible in your job, you can consider part time german teaching jobs openings that will allow you to earn some extra money without making much change in your lifestyle and will provide you with experience in teaching.</p>",
    "<h4>Customized Teaching Experience</h4>",
    "<p>Many people nowadays like personal lessons as they give learners an opportunity to move at their own rhythm. As a german language private tutor, you will be making personalized lesson plans according to individual needs of every learner.</p>",
    "<p>No matter if the learners are preparing for Goethe exam, are going to study in Germany, or just want to improve their fluency, your tutoring will lead to significant results.</p>",
    "<h4>Online German Lessons That Suit Your Schedule</h4>",
    "<p>When looking for online german teachers, you will love the convenience that comes with our service. Online tutoring from the comfort of your own home at a schedule of your own and teaching dedicated students that want to learn German.</p>",
    "<p>Our tutors are free to schedule classes any time during weekdays, evenings, and even weekends, making online teaching the perfect career choice for both full-time and part-time tutors.</p>",
    "<h4>Teach Them with Confidence</h4>",
    "<p>There is a wide range of students that opt for a private teacher German because they get personalized attention and lessons based on their needs. Being one of our tutors, you will be able to teach them how to enhance their grammar, pronunciation, vocabulary, reading, writing, listening, and speaking skills via online sessions.</p>",
    "<p>Your guidance will be instrumental in helping them build confidence to use German in various scenarios.</p>",
    "<h4>Application Requirements</h4>",
    "<p>We are seeking dedicated teachers who can teach excellent German classes. The following qualifications will be required from ideal applicants:</p>",
    "<ul><li>Good fluency in the German language (B2, C1 or C2 preferred)</li><li>Good communication skills</li><li>Prior experience in teaching or tutoring</li><li>Ability to conduct interactive online classes</li><li>Good internet connectivity and teaching equipment</li><li>Love for teaching and making the students successful</li></ul>",
    "<p>Applicants with relevant certificates such as Goethe, TestDaF, TELC and others are invited to apply.</p>",
    "<h4>What You'll Teach</h4>",
    "<p>As one of our instructors, you will get to teach people preparing for many things like:</p>",
    "<ul><li>Goethe-Zertifikat (A1-C2)</li><li>TELC German Exams</li><li>TestDaF Preparation</li><li>German for Academic Purposes</li><li>German for Business Purposes</li><li>Conversational German</li><li>German for Study Abroad</li><li>Career Development German</li></ul>",
    "<p>Every class is a chance to motivate your students and open up new academic and career prospects for them.</p>",
    "<h4>Why Tutoring With Us is Popular Among Educators</h4>",
    "<p>Being a tutor with us means being part of a collective learning community. Professionals who regularly explore a german job portal for teaching opportunities will find us to be an excellent platform for building a rewarding online teaching career. Our tutors matter to us and we offer them everything required for their success. Benefits are:</p>",
    "<ul><li>Flexibility in working hours</li><li>Remote teaching possibilities</li><li>Attractive remuneration</li><li>Consistent registration of new students</li><li>Academic assistance and mentoring</li><li>Teaching materials provided</li><li>Professional development opportunities</li><li>Collaborative working environment</li><li>Working with students from all around the world</li></ul>",
    "<h4>Application Procedure</h4>",
    "<p>The process of applying to us is quite easy. Fill out the application form with your qualifications, certification, teaching experience, language skills, and availability.</p>",
    "<p>Our recruitment team will evaluate all the applications and contact the shortlisted applicants for the subsequent hiring process. We appreciate educators who are enthusiastic and committed to delivering a great learning experience to their students.</p>",
    "<h4>Apply Jobs for Online German Tutors</h4>",
    "<p>If you've been browsing german job sites in search of flexible and meaningful teaching opportunities, this is your chance to join a trusted online German language institute. Be a part of our expanding team of teachers and assist your students in achieving their German language objectives through effective online classes.</p>",
    "<p>With Fluentauf, you will be able to experience an adaptive teaching setup, consistent academic assistance, and the chance to teach diverse learners. Whether you are a skilled tutor or a prospective German language teacher, we request you to get in touch with us with your profile.</p>",
    "<p>Fill in the application form below with your credentials, experience, certification, and availability. Our recruiting team will take care of your application and will shortlist you.</p>",
    "<p>Apply now and begin your teaching career.</p>",
  ].join("\n"),
  seo: {
    metaTitle: "Apply Job | Fluent AUF",
    metaKeyword: "German tutor jobs, online German teacher, teach German online, Fluent AUF careers",
    metaDescription:
      "Join Fluent AUF — build a rewarding career in German language education. Grow, lead, and thrive with our team.",
  },
};

export const defaultGermanLanguageCourseContent: GermanLanguageCoursePageData = {
  pageTitle: "German Language Course",
  pageDescription:
    "Choose the right German level for your goals — from beginner A1 to advanced C2.",
  seo: {
    metaTitle: "German Courses A1–C2 | Fluent AUF",
    metaKeyword: "German Language Course, Online German Classes, Learn German",
    metaDescription:
      "Explore Fluent AUF German language courses from A1 to C2 with live classes, certified tutors, and Goethe-focused preparation.",
  },
};

export const defaultGeneralPagesContent: GeneralPagesContent = {
  terms: defaultTermsContent,
  privacy: defaultPrivacyContent,
  refund: defaultRefundContent,
  ourCompany: defaultOurCompanyContent,
  applyJob: defaultApplyJobContent,
  germanLanguageCourse: defaultGermanLanguageCourseContent,
};

export type FacultyMember = {
  name: string;
  image: string;
  role: string;
  focus: string;
};

export const trainers: FacultyMember[] = [
  {
    name: "Khusi Sharma",
    image: "/courses/khusi-sharma.jpg",
    role: "Lead German Trainer",
    focus: "A1 – B2 · Goethe Prep",
  },
  {
    name: "Arti",
    image: "/courses/instructor.jpg",
    role: "Senior Trainer",
    focus: "A1 – C1 · Speaking & Grammar",
  },
  {
    name: "Vibha",
    image: "/portal-education.jpg",
    role: "German Trainer",
    focus: "A2 – B2 · Exam Mocks",
  },
  {
    name: "Shubhra",
    image: "/webinar-student.jpg",
    role: "German Trainer",
    focus: "A1 – A2 · Beginners",
  },
  {
    name: "Payal",
    image: "/hero-students.jpg",
    role: "German Trainer",
    focus: "B1 – B2 · Advanced",
  },
  {
    name: "Neha",
    image: "/courses/german-a1.jpg",
    role: "German Trainer",
    focus: "A1 – B1 · Online Batches",
  },
  {
    name: "Rahul",
    image: "/courses/german-hero.jpg",
    role: "German Trainer",
    focus: "B2 – C2 · Certification",
  },
  {
    name: "Priya",
    image: "/portal-education.jpg",
    role: "German Trainer",
    focus: "A1 – B1 · Weekend Batches",
  },
];

export const supportTeam: FacultyMember[] = [
  {
    name: "Sanjiv",
    image: "/hero-students.jpg",
    role: "Academic Coordinator",
    focus: "Batch Scheduling",
  },
  {
    name: "Rashi",
    image: "/webinar-student.jpg",
    role: "Student Counsellor",
    focus: "Admissions & Guidance",
  },
  {
    name: "Rutvi",
    image: "/portal-education.jpg",
    role: "Operations Lead",
    focus: "Class Support",
  },
  {
    name: "Kadir",
    image: "/courses/german-hero.jpg",
    role: "Digital Learning",
    focus: "Portal & Resources",
  },
];

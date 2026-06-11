export type FacultyMember = {
  name: string;
  image: string;
  role: string;
  focus: string;
};

export const trainers: FacultyMember[] = [
  {
    name: "Khushi Sharma",
    image: "/tutors/khushi-sharma.jpg",
    role: "Lead German Trainer",
    focus: "A1 – B2 · Goethe Prep",
  },
  {
    name: "Khushi Birsat",
    image: "/tutors/khushi-birsat.jpg",
    role: "Senior German Trainer",
    focus: "A1 – C1 · Speaking & Grammar",
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

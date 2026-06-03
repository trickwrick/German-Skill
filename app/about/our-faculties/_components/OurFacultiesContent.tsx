import Image from "next/image";
import Link from "next/link";

type FacultyMember = {
  name: string;
  image: string;
  role: string;
  focus: string;
};

const trainers: FacultyMember[] = [
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

const supportTeam: FacultyMember[] = [
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

function FacultyCard({ member }: { member: FacultyMember }) {
  return (
    <article className="of-member-card">
      <div className="of-member-photo-wrap">
        <Image
          src={member.image}
          alt={member.name}
          width={280}
          height={320}
          className="of-member-photo"
        />
      </div>
      <div className="of-member-body">
        <h3>{member.name}</h3>
        <span className="of-member-role">{member.role}</span>
        <span className="of-member-focus">{member.focus}</span>
      </div>
    </article>
  );
}

export default function OurFacultiesContent() {
  return (
    <>
      <section className="of-intro">
        <div className="of-intro-inner">
          <span className="of-tag">21+ Certified Trainers</span>
          <h2>
            Learn from trainers who <span>know German exams inside out</span>
          </h2>
          <p>
            Our faculty combines classroom experience with Goethe and telc preparation expertise.
            Every trainer is selected for clarity, patience, and results — so you progress with
            confidence at every level from A1 to C2.
          </p>
        </div>
      </section>

      <section className="of-trainers">
        <div className="of-section-head">
          <span className="of-tag of-tag-gold">Faculty Team</span>
          <h2>Meet our German trainers</h2>
          <p>
            Certified mentors who guide you through grammar, speaking, writing, and exam strategy —
            in live classes and focused doubt sessions.
          </p>
        </div>
        <div className="of-grid">
          {trainers.map((member) => (
            <FacultyCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="of-support">
        <div className="of-section-head">
          <span className="of-tag">Behind the scenes</span>
          <h2>Internal support team</h2>
          <p>
            Counsellors and coordinators who keep batches running smoothly — from enrollment
            and scheduling to student portal support.
          </p>
        </div>
        <div className="of-grid">
          {supportTeam.map((member) => (
            <FacultyCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      <section className="of-cta">
        <div className="of-cta-card">
          <div className="of-cta-copy">
            <h2>Want to learn with our faculty?</h2>
            <p>
              Book a free demo class and meet the teaching approach firsthand. We&apos;ll help you
              pick the right level and batch.
            </p>
          </div>
          <Link href="/contact" className="btn btn-primary of-cta-btn">
            Book Free Demo
          </Link>
        </div>
      </section>
    </>
  );
}

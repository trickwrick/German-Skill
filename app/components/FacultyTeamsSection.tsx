import Image from "next/image";
import type { FacultyMember } from "../../data/facultyMembers";
import { supportTeam, trainers } from "../../data/facultyMembers";

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

export default function FacultyTeamsSection() {
  return (
    <>
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
    </>
  );
}

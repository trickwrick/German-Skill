import Image from "next/image";
import { trainers } from "../../data/facultyMembers";

export default function TutorsSection() {
  return (
    <section className="tutors-section" id="tutors">
      <div className="tutors-inner">
        <div className="tutors-header">
          <h2>Meet Our German Tutors</h2>
          <p>
            Learn from inspirational German language certified tutors who will guide and support
            you every step of the way.
          </p>
        </div>

        <div className="tutors-grid">
          {trainers.map((tutor) => (
            <article key={tutor.name} className="tutor-card">
              <div className="tutor-card-image-wrap">
                <Image
                  src={tutor.image}
                  alt={tutor.name}
                  width={280}
                  height={320}
                  className="tutor-card-image"
                />
              </div>
              <div className="tutor-card-body">
                <div className="tutor-card-name">{tutor.name}</div>
                <p className="tutor-card-qualification">{tutor.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { defaultOurCompanyContent, type OurCompanyPageData } from "../../data/generalPages";

type FacultyTeamsSectionProps = {
  content?: OurCompanyPageData["faculty"];
};

function FacultyCard({ member }: { member: OurCompanyPageData["faculty"]["members"][number] }) {
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
      </div>
    </article>
  );
}

export default function FacultyTeamsSection({
  content = defaultOurCompanyContent.faculty,
}: FacultyTeamsSectionProps) {
  return (
    <section className="of-trainers">
      <div className="of-section-head">
        <span className="of-tag of-tag-gold">{content.tag}</span>
        <h2>{content.heading}</h2>
        <p>{content.description}</p>
      </div>
      <div className="of-grid">
        {content.members.map((member) => (
          <FacultyCard key={`${member.name}-${member.image}`} member={member} />
        ))}
      </div>
    </section>
  );
}

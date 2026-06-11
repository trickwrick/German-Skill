import Image from "next/image";
import Link from "next/link";

const cultureCards = [
  {
    title: "Learn and Grow",
    text: "We empower employees through growth opportunities, open communication, flexible work culture, and recognition.",
    image: "/courses/instructor.jpg",
    theme: "blue",
  },
  {
    title: "Innovate with Impact",
    text: "We empower employees through growth opportunities, open communication, flexible work culture, and recognition.",
    theme: "rose",
    image: "/portal-education.jpg",
  },
  {
    title: "Belong and Be You",
    text: "We empower employees through growth opportunities, open communication, flexible work culture, and recognition.",
    theme: "sun",
    image: "/tutors/khushi-sharma.jpg",
  },
];

function CultureArt({ theme }: { theme: string }) {
  return (
    <div className={`cr-culture-art cr-culture-art-${theme}`} aria-hidden="true">
      <span className="cr-shape cr-shape-1" />
      <span className="cr-shape cr-shape-2" />
      <span className="cr-shape cr-shape-3" />
      <span className="cr-shape cr-shape-4" />
      <span className="cr-shape cr-shape-5" />
    </div>
  );
}

const galleryImages = [
  { src: "/hero-students.jpg", alt: "Team outing at Fluent AUF", layout: "left-tall" },
  { src: "/portal-education.jpg", alt: "Interactive classroom session", layout: "mid-top" },
  { src: "/webinar-student.jpg", alt: "Online learning session", layout: "right-top" },
  { src: "/courses/instructor.jpg", alt: "Faculty member at Fluent AUF", layout: "left-bottom" },
  { src: "/courses/german-hero.jpg", alt: "Students learning German", layout: "mid-bottom" },
  { src: "/courses/german-a1.jpg", alt: "Batch activity at institute", layout: "right-bottom" },
];

export default function CareersContent() {
  return (
    <>
      <section className="cr-culture">
        <div className="cr-culture-inner">
          <h2>At Fluent AUF we bring out the best in you.</h2>
          <div className="cr-culture-grid">
            {cultureCards.map((card) => (
              <article key={card.title} className={`cr-culture-card cr-culture-${card.theme}`}>
                <div className="cr-culture-visual">
                  <CultureArt theme={card.theme} />
                  <div className="cr-culture-photo-wrap">
                    <Image
                      src={card.image}
                      alt=""
                      width={220}
                      height={280}
                      className="cr-culture-photo"
                    />
                  </div>
                </div>
                <div className="cr-culture-body">
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cr-who-banner">
        <div className="cr-who-inner">
          <h2>Who We Are</h2>
          <p>
            As a trusted name in German language education since 2013, Fluent AUF stands at the
            intersection of innovation, integrity, and student success.
          </p>
          <Link href="/about/our-company" className="cr-who-btn">
            Learn More
          </Link>
        </div>
      </section>

      <section className="cr-life">
        <div className="cr-life-inner">
          <h2>Life at Fluent AUF</h2>
          <div className="cr-gallery">
            {galleryImages.map((item) => (
              <div key={item.src} className={`cr-gallery-item cr-gallery-${item.layout}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="cr-gallery-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

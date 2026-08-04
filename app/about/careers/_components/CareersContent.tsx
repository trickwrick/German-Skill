import Link from "next/link";
import { sitePhoneDisplay, sitePhoneTel } from "../../../../data/siteContact";
import TutorApplicationForm from "./TutorApplicationForm";

const tutorHelpTopics = [
  "Online teaching roles",
  "Flexible batch schedules",
  "Certified trainer opportunities",
  "A1 to C2 level openings",
  "Interview and onboarding support",
];

const applicationRequirements = [
  "Good fluency in the German language (B2, C1 or C2 preferred)",
  "Good communication skills",
  "Prior experience in teaching or tutoring",
  "Ability to conduct interactive online classes",
  "Good internet connectivity and teaching equipment",
  "Love for teaching and making the students successful",
];

const teachingTopics = [
  "Goethe-Zertifikat (A1-C2)",
  "TELC German Exams",
  "TestDaF Preparation",
  "German for Academic Purposes",
  "German for Business Purposes",
  "Conversational German",
  "German for Study Abroad",
  "Career Development German",
];

const tutorBenefits = [
  "Flexibility in working hours",
  "Remote teaching possibilities",
  "Attractive remuneration",
  "Consistent registration of new students",
  "Academic assistance and mentoring",
  "Teaching materials provided",
  "Professional development opportunities",
  "Collaborative working environment",
  "Working with students from all around the world",
];

export default function CareersContent() {
  return (
    <>
      <section className="cr-tutor-section contact-section">
        <div className="contact-intro">
          <h2>Join Our German Tutor Team</h2>
          <p>Inspire Students. Teach German. Launch Your Career.</p>
        </div>

        <div className="contact-layout">
          <div id="tutor-application-form">
            <TutorApplicationForm />
          </div>

          <aside className="contact-info-panel">
            <div className="contact-info-cards">
              <div className="contact-info-card">
                <span className="contact-info-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16v16H4z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <div>
                  <span className="contact-info-label">Email</span>
                  <a href="mailto:fluentauf@gmail.com" className="contact-info-value">
                    fluentauf@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-info-card">
                <span className="contact-info-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>
                <div>
                  <span className="contact-info-label">Phone, WhatsApp</span>
                  <a href={`tel:${sitePhoneTel}`} className="contact-info-value">
                    {sitePhoneDisplay}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-help-box">
              <h3>What We Look For</h3>
              <ul>
                {tutorHelpTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>

            <div className="contact-demo-box">
              <h3>Have Questions?</h3>
              <p>
                Reach out to our team for more details about tutor roles, timings, and the selection
                process.
              </p>
              <Link href="/contact" className="btn btn-primary contact-demo-btn">
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="cr-tutor-info-section">
        <div className="cr-tutor-info-wrap">
          <article className="cr-tutor-scroll-box" aria-label="German tutor careers information">
            <div className="cr-tutor-scroll-inner">
              <p>
                Do you love inspiring students by helping them learn German and reach their
                linguistic targets? Then we are looking for highly committed, experienced, and
                passionate teachers. Are you looking for german tutor jobs online? You have found
                the best place. We give you a chance to inspire our motivated learners, develop
                professionally, and leave a positive imprint via quality education provided online.
              </p>
              <p>
                No matter if you are a seasoned teacher or simply a certified expert in the field of
                German language, you will become an important member of our supportive family which
                values innovation, flexibility, and academic success of our tutors.
              </p>

              <h4>Why Should You Work With Us?</h4>
              <p>
                We are convinced that great teachers foster great learners. That is why we are able
                to provide such a unique atmosphere that tutors can concentrate on their teaching,
                and we will be there with all the required academic support and continuous influx of
                students.
              </p>
              <p>
                If you are interested in finding german tutor jobs work from home, our online system
                will help you teach from home without breaking your professional plans.
              </p>

              <h4>Educate Students Around the Globe</h4>
              <p>
                Our students hail from various nations and have diverse backgrounds. While some of
                them may be learning German in order to pursue higher education, some may need the
                language for work purposes, moving to another country, traveling, and even
                self-improvement.
              </p>
              <p>
                If you have been working as a German language teacher online before, then you will
                educate students of different levels—from absolute beginner level to advanced level
                who need to pass internationally acknowledged German language tests. Every class will
                contribute towards improving your students&apos; confidence.
              </p>

              <h4>Be Your Student&apos;s Language Coach</h4>
              <p>
                In addition to teaching the basic concepts of grammar and vocabulary, as a german
                language coach, you will encourage your students, make them more confident, and lead
                them on the path of learning according to their requirements.
              </p>

              <h4>Flexible Online Teaching Opportunities</h4>
              <p>
                We constantly increase the teaching faculty and recruit outstanding talent for remote
                german teacher jobs. Regardless of whether you are looking for a career or need some
                extra cash, our flexible model will make it possible for you to teach from any
                location that has access to stable Internet connectivity.
              </p>
              <p>
                As our student base increases, we often have german teacher vacancies for dedicated
                individuals who want to establish a successful career in teaching online.
              </p>
              <p>
                If you want to be flexible in your job, you can consider part time german teaching
                jobs openings that will allow you to earn some extra money without making much change
                in your lifestyle and will provide you with experience in teaching.
              </p>

              <h4>Customized Teaching Experience</h4>
              <p>
                Many people nowadays like personal lessons as they give learners an opportunity to
                move at their own rhythm. As a german language private tutor, you will be making
                personalized lesson plans according to individual needs of every learner.
              </p>
              <p>
                No matter if the learners are preparing for Goethe exam, are going to study in
                Germany, or just want to improve their fluency, your tutoring will lead to
                significant results.
              </p>

              <h4>Online German Lessons That Suit Your Schedule</h4>
              <p>
                When looking for online german teachers, you will love the convenience that comes
                with our service. Online tutoring from the comfort of your own home at a schedule of
                your own and teaching dedicated students that want to learn German.
              </p>
              <p>
                Our tutors are free to schedule classes any time during weekdays, evenings, and even
                weekends, making online teaching the perfect career choice for both full-time and
                part-time tutors.
              </p>

              <h4>Teach Them with Confidence</h4>
              <p>
                There is a wide range of students that opt for a private teacher German because they
                get personalized attention and lessons based on their needs. Being one of our tutors,
                you will be able to teach them how to enhance their grammar, pronunciation,
                vocabulary, reading, writing, listening, and speaking skills via online sessions.
              </p>
              <p>
                Your guidance will be instrumental in helping them build confidence to use German in
                various scenarios.
              </p>

              <h4>Application Requirements</h4>
              <p>
                We are seeking dedicated teachers who can teach excellent German classes. The
                following qualifications will be required from ideal applicants:
              </p>
              <ul>
                {applicationRequirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Applicants with relevant certificates such as Goethe, TestDaF, TELC and others are
                invited to apply.
              </p>

              <h4>What You&apos;ll Teach</h4>
              <p>
                As one of our instructors, you will get to teach people preparing for many things
                like:
              </p>
              <ul>
                {teachingTopics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>
                Every class is a chance to motivate your students and open up new academic and career
                prospects for them.
              </p>

              <h4>Why Tutoring With Us is Popular Among Educators</h4>
              <p>
                Being a tutor with us means being part of a collective learning community.
                Professionals who regularly explore a german job portal for teaching opportunities
                will find us to be an excellent platform for building a rewarding online teaching
                career. Our tutors matter to us and we offer them everything required for their
                success. Benefits are:
              </p>
              <ul>
                {tutorBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h4>Application Procedure</h4>
              <p>
                The process of applying to us is quite easy. Fill out the application form with your
                qualifications, certification, teaching experience, language skills, and
                availability.
              </p>
              <p>
                Our recruitment team will evaluate all the applications and contact the shortlisted
                applicants for the subsequent hiring process. We appreciate educators who are
                enthusiastic and committed to delivering a great learning experience to their
                students.
              </p>

              <h4>Apply Jobs for Online German Tutors</h4>
              <p>
                If you&apos;ve been browsing german job sites in search of flexible and meaningful
                teaching opportunities, this is your chance to join a trusted online German language
                institute. Be a part of our expanding team of teachers and assist your students in
                achieving their German language objectives through effective online classes.
              </p>
              <p>
                With Fluentauf, you will be able to experience an adaptive teaching setup, consistent
                academic assistance, and the chance to teach diverse learners. Whether you are a
                skilled tutor or a prospective German language teacher, we request you to get in
                touch with us with your profile.
              </p>
              <p>
                Fill in the application form below with your credentials, experience, certification,
                and availability. Our recruiting team will take care of your application and will
                shortlist you.
              </p>
              <p>Apply now and begin your teaching career.</p>
            </div>
          </article>
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
    </>
  );
}

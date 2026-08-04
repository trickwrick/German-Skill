import Link from "next/link";
import { sitePhoneDisplay, sitePhoneTel } from "../../../../data/siteContact";
import { sanitizeBlogHtml } from "../../../../lib/blogHtmlUtils";
import TutorApplicationForm from "./TutorApplicationForm";

const tutorHelpTopics = [
  "Online teaching roles",
  "Flexible batch schedules",
  "Certified trainer opportunities",
  "A1 to C2 level openings",
  "Interview and onboarding support",
];

type CareersContentProps = {
  applyJobHtml: string;
};

export default function CareersContent({ applyJobHtml }: CareersContentProps) {
  const scrollHtml = sanitizeBlogHtml(applyJobHtml);

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
            {scrollHtml ? (
              <div
                className="cr-tutor-scroll-inner blog-prose"
                dangerouslySetInnerHTML={{ __html: scrollHtml }}
              />
            ) : null}
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

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import ContactForm from "./_components/ContactForm";
import { sitePhoneDisplay, sitePhoneTel } from "../../data/siteContact";
import { buildPageMetadata } from "../../lib/siteSeo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us | Fluent AUF",
  description:
    "Get in touch with Fluent AUF for course enquiries, batch schedules, demo classes, and admissions support.",
  path: "/contact",
});

const contactDetails = [
  {
    label: "Email",
    value: "fluentauf@gmail.com",
    href: "mailto:fluentauf@gmail.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16v16H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    label: "Phone, WhatsApp",
    value: sitePhoneDisplay,
    href: `tel:${sitePhoneTel}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: "Opening Hours",
    value: "MON – SUN · 7:00 AM – 8:00 PM",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const helpTopics = [
  "Course level guidance (A1 to C2)",
  "Upcoming batch schedules",
  "Fees, offers & payment options",
  "Free demo class booking",
  "Corporate & group training",
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="course-detail-hero contact-hero">
          <div className="course-detail-hero-overlay" aria-hidden="true" />
          <div className="course-detail-hero-content">
            <h1>Contact Us</h1>
            <nav className="course-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">•</span>
              <span>Contact Us</span>
            </nav>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-intro">
            <h2>We&apos;re Here to Help You Learn German</h2>
            <p>
              Whether you&apos;re starting from A1 or preparing for advanced certification,
              our counsellors are ready to guide you with the right course and batch.
            </p>
          </div>

          <div className="contact-layout">
            <div id="contact-form">
              <ContactForm />
            </div>

            <aside className="contact-info-panel">
              <div className="contact-info-cards">
                {contactDetails.map((item) => (
                  <div key={item.label} className="contact-info-card">
                    <span className="contact-info-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div>
                      <span className="contact-info-label">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="contact-info-value">
                          {item.value}
                        </a>
                      ) : (
                        <span className="contact-info-value">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-help-box">
                <h3>How Can We Help?</h3>
                <ul>
                  {helpTopics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>

              <div className="contact-demo-box">
                <h3>Book a Free Demo Class</h3>
                <p>
                  Experience our teaching style before you enroll. No commitment required.
                </p>
                <Link href="#contact-form" className="btn btn-primary contact-demo-btn">
                  Book Free Demo
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

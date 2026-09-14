import Link from "next/link";
import type { CityJourneySectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

type CityJourneyCtaProps = {
  data?: CityJourneySectionData;
};

const defaultSteps = [
  {
    step: "1",
    title: "Counselling & Enrolment",
    text: "Speak to our admissions counselor. We will assess your goals and place you in the right level & batch.",
  },
  {
    step: "2",
    title: "Live Online Training",
    text: "Attend live interactive sessions with expert faculty. Complete your 60 hrs of training and group discussions.",
  },
  {
    step: "3",
    title: "Exam Preparation",
    text: "Complete focused Goethe / TELC / TestDaF preparation, mock tests, and personalised feedback.",
  },
  {
    step: "4",
    title: "Certification & Placement",
    text: "Earn your German Skill certificate. Access placement support, alumni network, and next-level enrolment.",
  },
];

export default function CityJourneyCta({ data }: CityJourneyCtaProps) {
  const buttonText = data?.buttonText?.trim() || "Start Your Journey Now";
  const buttonHref = data?.buttonHref?.trim() || "/contact";
  const text = data?.text?.trim();

  return (
    <>
      <section className="city-journey-steps">
        <div className="city-journey-steps-inner">
          <header className="city-journey-steps-header">
            <span className="city-journey-sub-title">YOUR JOURNEY TO MASTERY</span>
            <h2>
              4 simple steps to <em>fluent German</em>
            </h2>
          </header>

          <div className="city-journey-steps-grid">
            {defaultSteps.map((item) => (
              <div key={item.step} className="city-journey-step-card">
                <span className="city-journey-step-badge">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="city-journey-cta">
        <div className="city-journey-cta-inner">
          <div className="city-journey-card">
            {text ? <CityRichHtml html={text} className="city-journey-copy" /> : null}
            <Link href={buttonHref} className="city-journey-btn">
              {buttonText}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}



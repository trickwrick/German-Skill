import Image from "next/image";
import Link from "next/link";

const certificateBenefits = [
  {
    title: "Stand Out:",
    text: "Gain formal recognition of your German language skills.",
  },
  {
    title: "Validate Proficiency:",
    text: "Demonstrate your ability to communicate in German for study, work, and travel.",
  },
  {
    title: "Unlock Opportunities:",
    text: "Enhance career prospects and cultural experiences across Europe.",
  },
  {
    title: "Gain an Edge:",
    text: "Strengthen your resume with this valuable credential.",
  },
];

export default function CertificateSection() {
  return (
    <section className="certificate-section">
      <div className="certificate-inner">
        <div className="certificate-copy">
          <h2>Obtain Your German Language Course Certificate</h2>
          <p className="certificate-intro">
            Upon successful completion of your Goethe / TELC preparation course, you will receive
            a Certificate of Completion from Fluent AUF.
          </p>

          <ul className="certificate-benefits">
            {certificateBenefits.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong> {item.text}
              </li>
            ))}
          </ul>

          <p className="certificate-cta-text">Invest in your future today!</p>
          <Link href="/contact" className="btn btn-certificate-demo">
            Book A Demo
          </Link>
        </div>

        <div className="certificate-visual">
          <Image
            src="/certificate-sample.svg"
            alt="Sample German language course certificate from Fluent AUF"
            title="Sample German language course certificate from Fluent AUF"
            width={560}
            height={392}
            className="certificate-image"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { homeFaqItems } from "../../data/faqsContent";
import FaqAccordion from "../about/faqs/_components/FaqAccordion";

export default function HomeFaqSection() {
  const [openId, setOpenId] = useState<string | null>(homeFaqItems[0]?.id ?? null);

  return (
    <section className="hp-faq-section" id="faq">
      <div className="hp-faq-inner">
        <div className="hp-faq-header">
          <span className="hp-faq-tag">FAQs</span>
          <h2>Frequently Asked Questions</h2>
          <p>
            Quick answers about courses, Goethe preparation, batches, and demo classes.
          </p>
        </div>

        <div className="fq-accordion-list hp-faq-list">
          {homeFaqItems.map((item) => (
            <FaqAccordion
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
            />
          ))}
        </div>

        <div className="hp-faq-footer">
          <Link href="/about/faqs" className="btn btn-primary hp-faq-view-all">
            View All FAQs
          </Link>
        </div>
      </div>
    </section>
  );
}

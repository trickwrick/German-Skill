"use client";

import { useState } from "react";
import type { HomeFaqContent } from "../../data/homeFaqs";
import FaqAccordion from "../about/faqs/_components/FaqAccordion";
import RichHtmlContent from "./RichHtmlContent";

type HomeFaqSectionProps = {
  content: HomeFaqContent;
};

export default function HomeFaqSection({ content }: HomeFaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(content.items[0]?.id ?? null);

  if (content.items.length === 0) {
    return null;
  }

  return (
    <section className="hp-faq-section" id="faq">
      <div className="hp-faq-inner">
        <div className="hp-faq-header">
          <h2>{content.title}</h2>
          <span className="hp-faq-title-rule" aria-hidden="true" />
          <RichHtmlContent html={content.subtitle} className="hp-faq-subtitle" />
        </div>

        <div className="fq-accordion-list hp-faq-list">
          {content.items.map((item) => (
            <FaqAccordion
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
              iconStyle="chevron"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

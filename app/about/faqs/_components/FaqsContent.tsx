"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { faqCategories } from "../../../../data/faqCategories";
import { faqItems } from "../../../../data/faqsContent";
import FaqAccordion from "./FaqAccordion";

function scrollToCategory(categoryId: string) {
  const section = document.getElementById(`faq-${categoryId}`);
  section?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function FaqsContent() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!trimmedQuery) return faqCategories;

    return faqCategories.filter((category) => {
      const categoryMatch =
        category.title.toLowerCase().includes(trimmedQuery) ||
        category.description.toLowerCase().includes(trimmedQuery);

      const faqMatch = faqItems.some(
        (item) =>
          item.categoryId === category.id &&
          (item.question.toLowerCase().includes(trimmedQuery) ||
            item.answer.toLowerCase().includes(trimmedQuery))
      );

      return categoryMatch || faqMatch;
    });
  }, [trimmedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!trimmedQuery) return faqItems;

    return faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(trimmedQuery) ||
        item.answer.toLowerCase().includes(trimmedQuery)
    );
  }, [trimmedQuery]);

  const visibleCategories = trimmedQuery
    ? filteredCategories.filter((category) =>
        filteredFaqs.some((item) => item.categoryId === category.id)
      )
    : faqCategories;

  return (
    <>
      <section className="fq-hero">
        <div className="fq-hero-texture" aria-hidden="true" />
        <div className="fq-hero-inner">
          <h1>How Can We Help?</h1>
          <label className="fq-search-label" htmlFor="faq-search">
            Search
          </label>
          <div className="fq-search-wrap">
            <input
              id="faq-search"
              type="search"
              className="fq-search-input"
              placeholder="Search FAQs..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="fq-categories">
        <div className="fq-categories-inner">
          <header className="fq-categories-header">
            <h2>Top Categories</h2>
            <p>Got questions? We&apos;ve got answers!</p>
          </header>

          <div className="fq-categories-grid">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="fq-category-card"
                onClick={() => scrollToCategory(category.id)}
              >
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </button>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <p className="fq-no-results">No categories match your search. Try a different keyword.</p>
          )}
        </div>
      </section>

      <section className="fq-list-section">
        <div className="fq-list-inner">
          {visibleCategories.map((category) => {
            const categoryFaqs = filteredFaqs.filter((item) => item.categoryId === category.id);
            if (categoryFaqs.length === 0) return null;

            return (
              <div key={category.id} className="fq-list-group" id={`faq-${category.id}`}>
                <h2>{category.title}</h2>
                <div className="fq-accordion-list">
                  {categoryFaqs.map((item) => (
                    <FaqAccordion
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openId === item.id}
                      onToggle={() =>
                        setOpenId((current) => (current === item.id ? null : item.id))
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="fq-no-results">No FAQs match your search. Try another keyword.</p>
          )}
        </div>
      </section>

      <section className="fq-cta">
        <div className="fq-cta-inner">
          <div className="fq-cta-copy">
            <h2>Didn&apos;t find what you were looking for?</h2>
            <p>If you need more info or help, our team is always happy to hear from you.</p>
          </div>
          <Link href="/contact" className="fq-cta-btn">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

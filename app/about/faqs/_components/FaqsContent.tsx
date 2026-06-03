"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { faqCategories } from "../../../../data/faqCategories";

export default function FaqsContent() {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return faqCategories;

    return faqCategories.filter(
      (category) =>
        category.title.toLowerCase().includes(trimmed) ||
        category.description.toLowerCase().includes(trimmed)
    );
  }, [query]);

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
              <article key={category.id} className="fq-category-card" id={category.id}>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <p className="fq-no-results">No categories match your search. Try a different keyword.</p>
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

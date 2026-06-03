"use client";

type FaqAccordionProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FaqAccordion({ question, answer, isOpen, onToggle }: FaqAccordionProps) {
  return (
    <article className={`fq-accordion-item${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="fq-accordion-trigger"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{question}</span>
        <span className="fq-accordion-icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="fq-accordion-panel">
          <p>{answer}</p>
        </div>
      )}
    </article>
  );
}

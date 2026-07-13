"use client";

type FaqAccordionProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  iconStyle?: "plus" | "chevron";
};

export default function FaqAccordion({
  question,
  answer,
  isOpen,
  onToggle,
  iconStyle = "plus",
}: FaqAccordionProps) {
  return (
    <article className={`fq-accordion-item${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="fq-accordion-trigger"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{question}</span>
        <span
          className={`fq-accordion-icon${iconStyle === "chevron" ? " fq-accordion-icon-chevron" : ""}${isOpen && iconStyle === "chevron" ? " is-open" : ""}`}
          aria-hidden="true"
        >
          {iconStyle === "chevron" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : isOpen ? (
            "−"
          ) : (
            "+"
          )}
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

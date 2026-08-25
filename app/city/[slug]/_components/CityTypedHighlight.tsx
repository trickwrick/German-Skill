"use client";

import { useEffect, useState } from "react";

type CityTypedHighlightProps = {
  texts: string[];
  prefix?: string;
  suffix?: string;
  typingSpeedMs?: number;
  pauseMs?: number;
  deleteSpeedMs?: number;
};

export default function CityTypedHighlight({
  texts,
  prefix = "",
  suffix = "",
  typingSpeedMs = 90,
  pauseMs = 1600,
  deleteSpeedMs = 45,
}: CityTypedHighlightProps) {
  const phrases = texts.map((item) => item.trim()).filter(Boolean);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  const text = phrases[phraseIndex % Math.max(phrases.length, 1)] || "";

  useEffect(() => {
    setPhraseIndex(0);
    setShown("");
    setPhase("typing");
  }, [phrases.join("|")]);

  useEffect(() => {
    if (!text) {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (shown.length < text.length) {
        timer = setTimeout(() => {
          setShown(text.slice(0, shown.length + 1));
        }, typingSpeedMs);
      } else {
        timer = setTimeout(() => setPhase("pause"), pauseMs);
      }
    } else if (phase === "pause") {
      timer = setTimeout(() => setPhase("deleting"), 200);
    } else if (shown.length > 0) {
      timer = setTimeout(() => {
        setShown(text.slice(0, shown.length - 1));
      }, deleteSpeedMs);
    } else {
      timer = setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % Math.max(phrases.length, 1));
        setPhase("typing");
      }, 280);
    }

    return () => clearTimeout(timer);
  }, [deleteSpeedMs, pauseMs, phase, phrases.length, shown, text, typingSpeedMs]);

  if (!phrases.length) {
    return prefix || suffix ? (
      <span className="city-typed-line">
        {prefix ? <span className="city-typed-prefix">{prefix}</span> : null}
        {suffix}
      </span>
    ) : null;
  }

  return (
    <span className="city-typed-line">
      {prefix ? <span className="city-typed-prefix">{prefix}</span> : null}
      <strong className="city-typed-text">
        {shown}
        <span className="city-typed-caret" aria-hidden="true" />
      </strong>
      {suffix}
    </span>
  );
}

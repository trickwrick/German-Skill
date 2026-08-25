"use client";

import { useEffect, useState } from "react";

type CityTypedHighlightProps = {
  text: string;
  prefix?: string;
  suffix?: string;
  typingSpeedMs?: number;
  pauseMs?: number;
  deleteSpeedMs?: number;
};

export default function CityTypedHighlight({
  text,
  prefix = "",
  suffix = "",
  typingSpeedMs = 90,
  pauseMs = 1600,
  deleteSpeedMs = 45,
}: CityTypedHighlightProps) {
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");

  useEffect(() => {
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
      timer = setTimeout(() => setPhase("typing"), 280);
    }

    return () => clearTimeout(timer);
  }, [deleteSpeedMs, pauseMs, phase, shown, text, typingSpeedMs]);

  return (
    <span className="city-typed-line">
      {prefix}
      <strong className="city-typed-text">
        {shown}
        <span className="city-typed-caret" aria-hidden="true" />
      </strong>
      {suffix}
    </span>
  );
}

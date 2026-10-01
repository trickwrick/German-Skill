import React from "react";
import type { CityMiddleSectionData } from "../../../../data/cityPages";
import CityRichHtml from "./CityRichHtml";

export default function CityMiddleSection({ data }: { data?: CityMiddleSectionData }) {
  if (!data || (!data.heading && !data.text)) {
    return null;
  }

  return (
    <section className="city-middle-section" style={{ padding: "60px 20px", textAlign: "center", maxWidth: "1200px", margin: "0 auto" }}>
      {data.heading && (
        <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#111827" }}>
          {data.heading}
        </h2>
      )}
      {data.text && (
        <div style={{ fontSize: "1.1rem", color: "#4b5563", lineHeight: "1.6" }}>
          <CityRichHtml html={data.text} />
        </div>
      )}
    </section>
  );
}

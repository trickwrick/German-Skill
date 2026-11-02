"use client";

import { useEffect, useState } from "react";

type AnnouncementItem = {
  text: string;
  highlight?: string;
  rest?: string;
};

const defaultAnnouncements: AnnouncementItem[] = [
  {
    text: "Trusted by",
    highlight: "16,500+",
    rest: "students learning German with us",
  },
  {
    text: "German Made Easy — Learn Anytime, Anywhere",
  },
  {
    text: "A1–C2 Goethe Certified Live Online Classes",
  },
  {
    text: "Flexible Batches | Expert Tutors | Study Material Included",
  },
];

function AnnouncementItems({ customText }: { customText: string }) {
  if (customText.trim()) {
    return (
      <span className="top-announcement-item">
        {customText.trim()}
      </span>
    );
  }

  return (
    <>
      {defaultAnnouncements.map((item, index) => (
        <span key={`${item.text}-${index}`} className="top-announcement-item">
          {item.text}
          {item.highlight ? (
            <span className="top-announcement-badge">{item.highlight}</span>
          ) : null}
          {item.rest ? ` ${item.rest}` : ""}
        </span>
      ))}
    </>
  );
}

export default function TopAnnouncementBar() {
  const [customText, setCustomText] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    async function loadAnnouncement() {
      try {
        const res = await fetch("/api/announcement");
        if (!res.ok) return;
        const data = (await res.json()) as { customText?: string; isActive?: boolean };
        if (isMounted && data && typeof data.customText === "string") {
          setCustomText(data.customText);
        }
      } catch (err) {
        // Fallback to default silently
      }
    }
    loadAnnouncement();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="top-announcement-bar" aria-label="Site announcements">
      <div className="top-announcement-track">
        <div className="top-announcement-content">
          <AnnouncementItems customText={customText} />
        </div>
        <div className="top-announcement-content" aria-hidden="true">
          <AnnouncementItems customText={customText} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  defaultAnnouncements,
  type AnnouncementItem,
} from "../../data/announcement.types";

const ANNOUNCEMENT_STORAGE_KEY = "fluentauf_cached_announcement";

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
      {defaultAnnouncements.map((item: AnnouncementItem, index: number) => (
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

export default function TopAnnouncementBar({
  initialCustomText = "",
}: {
  initialCustomText?: string;
}) {
  const [customText, setCustomText] = useState<string>(initialCustomText);
  const [loaded, setLoaded] = useState<boolean>(Boolean(initialCustomText));

  useEffect(() => {
    // 1. Agar initialCustomText nahi tha, to pehle localStorage cache check karo
    if (!initialCustomText) {
      try {
        const cached = window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
        if (cached !== null) {
          setCustomText(cached);
          setLoaded(true);
        }
      } catch {
        // localStorage not available
      }
    }

    // 2. Background mein API se fresh data sync karo
    let isMounted = true;
    async function loadAnnouncement() {
      try {
        const res = await fetch("/api/announcement");
        if (!res.ok) {
          if (isMounted) setLoaded(true);
          return;
        }
        const data = (await res.json()) as { customText?: string; isActive?: boolean };
        if (isMounted && data && typeof data.customText === "string") {
          setCustomText(data.customText);
          setLoaded(true);
          try {
            window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, data.customText);
          } catch {
            // Ignore storage errors
          }
        } else if (isMounted) {
          setLoaded(true);
        }
      } catch {
        if (isMounted) setLoaded(true);
      }
    }

    loadAnnouncement();
    return () => {
      isMounted = false;
    };
  }, [initialCustomText]);

  return (
    <div
      className="top-announcement-bar"
      aria-label="Site announcements"
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div className="top-announcement-track">
        <div className="top-announcement-content">
          <AnnouncementItems customText={customText} />
          {customText.trim() && <AnnouncementItems customText={customText} />}
        </div>
        <div className="top-announcement-content" aria-hidden="true">
          <AnnouncementItems customText={customText} />
          {customText.trim() && <AnnouncementItems customText={customText} />}
        </div>
      </div>
    </div>
  );
}

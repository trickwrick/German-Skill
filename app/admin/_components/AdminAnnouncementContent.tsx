"use client";

import { useState } from "react";
import {
  defaultAnnouncements,
  type TopAnnouncementData,
  type AnnouncementItem,
} from "../../../data/announcement.types";

export default function AdminAnnouncementContent({
  initialData,
}: {
  initialData: TopAnnouncementData;
}) {
  const [data, setData] = useState<TopAnnouncementData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save announcement");

      setMessage({ text: "Announcement bar saved successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to save announcement.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  function handleClearCustomText() {
    setData((prev: TopAnnouncementData) => ({ ...prev, customText: "" }));
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Top Announcement Bar</h1>
          <p className="adm-page-subtitle">
            Manage the ticker and top announcement bar displayed across the website.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`adm-form-message ${
            message.type === "success" ? "adm-form-message-success" : "adm-form-message-error"
          }`}
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            background: message.type === "success" ? "#ecfdf5" : "#fef2f2",
            color: message.type === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Live Preview Section */}
      <section className="adm-panel" style={{ marginBottom: "24px" }}>
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Live Preview (Current Display)</h2>
        </div>
        <div style={{ padding: "16px" }}>
          <div
            style={{
              background: "linear-gradient(90deg, #111111 0%, #991118 50%, #111111 100%)",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {data.customText.trim() ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    background: "#eab308",
                    color: "#111",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  Custom
                </span>
                {data.customText}
              </span>
            ) : (
              <div style={{ display: "inline-flex", gap: "28px" }}>
                {defaultAnnouncements.map((item: AnnouncementItem, idx: number) => (
                  <span key={idx}>
                    {item.text}{" "}
                    {item.highlight && (
                      <span
                        style={{
                          background: "#eab308",
                          color: "#111",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {item.highlight}
                      </span>
                    )}{" "}
                    {item.rest}
                  </span>
                ))}
              </div>
            )}
          </div>
          <p style={{ marginTop: "10px", fontSize: "0.82rem", color: "#64748b" }}>
            {data.customText.trim()
              ? "🟢 Custom announcement is active. The default scrolling ticker is hidden and this custom message is shown."
              : "ℹ️ Custom announcement is empty. The default scrolling ticker is active on the website."}
          </p>
        </div>
      </section>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Custom Announcement Text</h2>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              htmlFor="customText"
              style={{ display: "block", fontWeight: 600, marginBottom: "8px", color: "#0f172a" }}
            >
              Custom Line / Notice
            </label>
            <input
              id="customText"
              type="text"
              value={data.customText}
              onChange={(e) => setData({ ...data, customText: e.target.value })}
              placeholder="e.g. New Batch Starting from Monday! Register now for special discount."
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                fontSize: "0.95rem",
              }}
            />
            <p style={{ marginTop: "6px", fontSize: "0.8rem", color: "#64748b" }}>
              * When a custom message is added, it replaces the default ticker lines. If left empty, the default announcement ticker will automatically be displayed.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                background: "#991118",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? "Saving..." : "Save Announcement"}
            </button>

            {data.customText.trim() && (
              <button
                type="button"
                onClick={handleClearCustomText}
                style={{
                  background: "#f1f5f9",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "10px 18px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Clear (Revert to Default)
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

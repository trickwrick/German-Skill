"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ContactQuery } from "../../../data/contactQuery.types";

function getQuerySourceLabel(source: ContactQuery["source"]) {
  if (source === "enroll") {
    return "Enroll Now";
  }

  if (source === "discount-popup") {
    return "Discount Popup";
  }

  return "Contact";
}

function formatQueryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type AdminQueriesContentProps = {
  initialQueries: ContactQuery[];
};

export default function AdminQueriesContent({ initialQueries }: AdminQueriesContentProps) {
  const router = useRouter();
  const [queries, setQueries] = useState(initialQueries);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewQuery, setViewQuery] = useState<ContactQuery | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    router.refresh();
  }, [router]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this contact query?");
    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/queries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not delete query.");
      }

      setQueries((current) => current.filter((query) => query.id !== id));
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete query.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="adm-queries">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Queries</h1>
          <p className="adm-page-subtitle">
            All contact, Enroll Now, and discount popup enquiries appear here. New submissions show a
            badge in the sidebar until you open this page.
          </p>
        </div>
      </div>

      <div className="adm-stat-grid adm-courses-stats">
        <article className="adm-stat-card">
          <div>
            <p className="adm-stat-label">Total Queries</p>
            <p className="adm-stat-value">{queries.length}</p>
          </div>
        </article>
      </div>

      {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">All Enquiries</h2>
        </div>

        {queries.length === 0 ? (
          <p className="adm-panel-note">No enquiries yet. Contact, Enroll Now, and discount popup submissions will show up here.</p>
        ) : (
          <div className="adm-table-wrap adm-queries-table-wrap">
            <table className="adm-table adm-table-queries">
              <colgroup>
                <col className="adm-col-date" />
                <col className="adm-col-source" />
                <col className="adm-col-name" />
                <col className="adm-col-contact" />
                <col className="adm-col-course" />
                <col className="adm-col-meta" />
                <col className="adm-col-message" />
                <col className="adm-col-actions" />
              </colgroup>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Course</th>
                  <th>City</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => {
                  const source = query.source ?? "contact";

                  return (
                  <tr key={query.id}>
                    <td className="adm-query-date">{formatQueryDate(query.createdAt)}</td>
                    <td>
                      <span className={`adm-query-source adm-query-source-${source}`}>
                        {getQuerySourceLabel(source)}
                      </span>
                    </td>
                    <td>
                      <strong>{query.name}</strong>
                    </td>
                    <td>
                      <div className="adm-query-contact">
                        <a href={`mailto:${query.email}`}>{query.email}</a>
                        <span>{query.phone}</span>
                      </div>
                    </td>
                    <td className="adm-query-course">{query.course}</td>
                    <td>
                      <div className="adm-query-meta">
                        {query.city ? <span>{query.city}</span> : <span>—</span>}
                      </div>
                    </td>
                    <td className="adm-query-message">{query.message}</td>
                    <td className="adm-query-actions" style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button
                        type="button"
                        className="adm-btn adm-btn-icon"
                        style={{ color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe" }}
                        title="View details"
                        onClick={() => setViewQuery(query)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      
                      <button
                        type="button"
                        className="adm-btn adm-btn-icon adm-btn-icon-danger"
                        disabled={deletingId === query.id}
                        aria-label={deletingId === query.id ? "Deleting enquiry" : "Delete enquiry"}
                        title="Delete enquiry"
                        onClick={() => handleDelete(query.id)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {viewQuery && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>Enquiry Details</h2>
              <button onClick={() => setViewQuery(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div style={{ padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Date</div>
                  <div style={{ color: "#334155" }}>{formatQueryDate(viewQuery.createdAt)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Source</div>
                  <div style={{ color: "#334155" }}>{getQuerySourceLabel(viewQuery.source)}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Name</div>
                  <div style={{ color: "#334155" }}>{viewQuery.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Email</div>
                  <div style={{ color: "#334155" }}>{viewQuery.email || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Phone</div>
                  <div style={{ color: "#334155" }}>{viewQuery.phone || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>City (Provided)</div>
                  <div style={{ color: "#334155" }}>{viewQuery.city || "—"}</div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Course</div>
                  <div style={{ color: "#334155" }}>{viewQuery.course}</div>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Message</div>
                  <div style={{ color: "#334155", padding: "12px", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", whiteSpace: "pre-wrap" }}>{viewQuery.message}</div>
                </div>
              </div>

              <div style={{ marginTop: "32px" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "1.05rem", color: "#0f172a", paddingBottom: "8px", borderBottom: "1px solid #e2e8f0" }}>Visitor Information (Approximate)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>IP Address</div>
                    <div style={{ color: "#334155" }}>{viewQuery.ip || "Not available"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Approx. Country</div>
                    <div style={{ color: "#334155" }}>{viewQuery.country || "Not available"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Approx. Region/State</div>
                    <div style={{ color: "#334155" }}>{viewQuery.region || "Not available"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Approx. City</div>
                    <div style={{ color: "#334155" }}>{viewQuery.geoCity || "Not available"}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>ISP / Organization</div>
                    <div style={{ color: "#334155" }}>{viewQuery.isp || "Not available"}</div>
                  </div>
                </div>
                <p style={{ marginTop: "16px", fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>Note: IP geolocation is approximate and should not be considered an exact physical address.</p>
              </div>
            </div>
            
            <div style={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}>
              <button onClick={() => setViewQuery(null)} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", color: "#334155", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

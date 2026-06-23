"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContactQuery } from "../../../data/contactQuery.types";

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
  const [error, setError] = useState("");

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
            Contact form and Enroll Now enquiries from the website appear here.
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
          <p className="adm-panel-note">No contact queries yet. New submissions will show up here.</p>
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
                  <th>City / Level</th>
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
                        {source === "enroll" ? "Enroll Now" : "Contact"}
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
                        {query.city ? <span>{query.city}</span> : null}
                        {query.level ? <span>{query.level}</span> : null}
                        {!query.city && !query.level ? <span>—</span> : null}
                      </div>
                    </td>
                    <td className="adm-query-message">{query.message}</td>
                    <td className="adm-query-actions">
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
    </div>
  );
}

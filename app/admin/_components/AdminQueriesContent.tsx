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
            Contact form submissions from the website appear here.
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
          <h2 className="adm-panel-title">Contact Form Submissions</h2>
        </div>

        {queries.length === 0 ? (
          <p className="adm-panel-note">No contact queries yet. New submissions will show up here.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Interested In</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query) => (
                  <tr key={query.id}>
                    <td>{formatQueryDate(query.createdAt)}</td>
                    <td>
                      <strong>{query.name}</strong>
                    </td>
                    <td>
                      <div className="adm-query-contact">
                        <a href={`mailto:${query.email}`}>{query.email}</a>
                        <span>{query.phone}</span>
                      </div>
                    </td>
                    <td>{query.course}</td>
                    <td className="adm-query-message">{query.message}</td>
                    <td>
                      <button
                        type="button"
                        className="adm-btn adm-btn-secondary adm-btn-small"
                        disabled={deletingId === query.id}
                        onClick={() => handleDelete(query.id)}
                      >
                        {deletingId === query.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

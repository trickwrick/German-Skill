"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CareerApplication } from "../../../data/careerApplication.types";

function formatApplicationDate(value: string) {
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

type AdminCareersContentProps = {
  initialApplications: CareerApplication[];
};

export default function AdminCareersContent({ initialApplications }: AdminCareersContentProps) {
  const router = useRouter();
  const [applications, setApplications] = useState(initialApplications);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    router.refresh();
  }, [router]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this career application?");
    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/careers?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not delete application.");
      }

      setApplications((current) => current.filter((application) => application.id !== id));
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete application.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="adm-queries adm-careers">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Careers</h1>
          <p className="adm-page-subtitle">
            All tutor applications appear here. New submissions show a badge in the sidebar until you
            open this page.
          </p>
        </div>
      </div>

      <div className="adm-stat-grid adm-courses-stats">
        <article className="adm-stat-card">
          <div>
            <p className="adm-stat-label">Total Applications</p>
            <p className="adm-stat-value">{applications.length}</p>
          </div>
        </article>
      </div>

      {error ? <p className="adm-form-message adm-form-message-error">{error}</p> : null}

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">All Career Applications</h2>
        </div>

        {applications.length === 0 ? (
          <p className="adm-panel-note">
            No career applications yet. Tutor form submissions will show up here.
          </p>
        ) : (
          <div className="adm-table-wrap adm-queries-table-wrap">
            <table className="adm-table adm-table-queries adm-table-careers">
              <colgroup>
                <col className="adm-col-date" />
                <col className="adm-col-name" />
                <col className="adm-col-contact" />
                <col className="adm-col-meta" />
                <col className="adm-col-course" />
                <col className="adm-col-message" />
                <col className="adm-col-actions" />
              </colgroup>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>City / Level</th>
                  <th>Experience</th>
                  <th>About</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="adm-query-date">{formatApplicationDate(application.createdAt)}</td>
                    <td>
                      <strong>{application.name}</strong>
                      {application.certification ? (
                        <div className="adm-career-cert">{application.certification}</div>
                      ) : null}
                    </td>
                    <td>
                      <div className="adm-query-contact">
                        <a href={`mailto:${application.email}`}>{application.email}</a>
                        <span>{application.phone}</span>
                      </div>
                    </td>
                    <td>
                      <div className="adm-query-meta">
                        <span>{application.city}</span>
                        <span>{application.germanLevel}</span>
                      </div>
                    </td>
                    <td className="adm-query-course">{application.experience}</td>
                    <td className="adm-query-message">{application.about}</td>
                    <td className="adm-query-actions">
                      <div className="adm-career-actions">
                        <a
                          href={`/api/admin/career-cvs/${encodeURIComponent(application.cvFileName)}`}
                          className="adm-btn adm-btn-secondary adm-btn-small"
                          download={application.cvOriginalName}
                        >
                          CV
                        </a>
                        <button
                          type="button"
                          className="adm-btn adm-btn-icon adm-btn-icon-danger"
                          disabled={deletingId === application.id}
                          aria-label={
                            deletingId === application.id
                              ? "Deleting application"
                              : "Delete application"
                          }
                          title="Delete application"
                          onClick={() => handleDelete(application.id)}
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
                      </div>
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

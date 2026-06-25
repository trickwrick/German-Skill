"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isStaticCourseSlug, type GermanCourse } from "../../../data/germanCourses";

type AdminCourseActionsProps = {
  course: GermanCourse;
};

export default function AdminCourseActions({ course }: AdminCourseActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const isStandard = isStaticCourseSlug(course.slug);

  async function handleDelete() {
    const confirmed = window.confirm(
      isStandard
        ? `Remove all saved edits for "${course.title}" and reset it to default settings?`
        : `Delete "${course.title}" permanently? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/courses?slug=${encodeURIComponent(course.slug)}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Could not delete course.");
      }

      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete course.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="adm-table-actions">
      <Link href={`/admin/courses/${course.slug}/edit`} className="adm-table-link">
        Edit
      </Link>
      <button
        type="button"
        className="adm-table-link adm-table-link-danger"
        disabled={deleting}
        onClick={handleDelete}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {error ? <span className="adm-table-action-error">{error}</span> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminNavItems } from "../../../data/adminDashboardData";

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "courses":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
      );
    case "city":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4v18" />
          <path d="M19 21V11l-6-4" />
        </svg>
      );
    case "blog":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "testimonials":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      );
    case "queries":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      );
    case "careers":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      );
    case "seo":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminSidebar({
  queryCount = 0,
  careerCount = 0,
}: {
  queryCount?: number;
  careerCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [queryBadgeDismissed, setQueryBadgeDismissed] = useState(false);
  const [careerBadgeDismissed, setCareerBadgeDismissed] = useState(false);
  const isQueriesPage = pathname.startsWith("/admin/queries");
  const isCareersPage = pathname.startsWith("/admin/careers");
  const visibleQueryCount = isQueriesPage || queryBadgeDismissed ? 0 : queryCount;
  const visibleCareerCount = isCareersPage || careerBadgeDismissed ? 0 : careerCount;

  useEffect(() => {
    if (queryCount === 0) {
      setQueryBadgeDismissed(false);
    }
  }, [queryCount]);

  useEffect(() => {
    if (careerCount === 0) {
      setCareerBadgeDismissed(false);
    }
  }, [careerCount]);

  function formatBadgeCount(count: number) {
    return count > 99 ? "99+" : String(count);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-head">
        <span className="adm-sidebar-menu-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </span>
        <strong>Admin Panel</strong>
      </div>

      <p className="adm-sidebar-label">Management</p>

      <nav className="adm-sidebar-nav" aria-label="Admin navigation">
        {adminNavItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-nav-link${isActive ? " adm-nav-link-active" : ""}`}
              onClick={() => {
                if (item.icon === "queries") {
                  setQueryBadgeDismissed(true);
                }
                if (item.icon === "careers") {
                  setCareerBadgeDismissed(true);
                }
              }}
            >
              <NavIcon name={item.icon} />
              <span className="adm-nav-link-text">{item.label}</span>
              {item.icon === "queries" && visibleQueryCount > 0 ? (
                <span className="adm-nav-badge" aria-label={`${visibleQueryCount} new enquiries`}>
                  {formatBadgeCount(visibleQueryCount)}
                </span>
              ) : null}
              {item.icon === "careers" && visibleCareerCount > 0 ? (
                <span className="adm-nav-badge" aria-label={`${visibleCareerCount} new applications`}>
                  {formatBadgeCount(visibleCareerCount)}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <button type="button" className="adm-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

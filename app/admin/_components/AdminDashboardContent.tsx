import Link from "next/link";
import {
  adminOverviewStats,
  adminStatCards,
  recentBlogPosts,
  recentCourses,
  recentTestimonials,
} from "../../../data/adminDashboardData";

function StatIcon({ theme }: { theme: string }) {
  const className = `adm-stat-icon adm-stat-icon-${theme}`;

  switch (theme) {
    case "green":
      return (
        <span className={className} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </span>
      );
    case "purple":
      return (
        <span className={className} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </span>
      );
    case "amber":
      return (
        <span className={className} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </span>
      );
    case "sky":
      return (
        <span className={className} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
      );
    default:
      return (
        <span className={className} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        </span>
      );
  }
}

export default function AdminDashboardContent() {
  return (
    <div className="adm-dashboard">
      <h1 className="adm-page-title">Admin Dashboard</h1>

      <div className="adm-stat-grid">
        {adminStatCards.map((card) => (
          <article key={card.id} className="adm-stat-card">
            <StatIcon theme={card.theme} />
            <div>
              <p className="adm-stat-label">{card.label}</p>
              <p className="adm-stat-value">{card.value}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="adm-panel">
        <h2 className="adm-panel-title">Content Overview</h2>
        <div className="adm-overview-grid">
          {adminOverviewStats.map((item) => (
            <article key={item.label} className="adm-overview-card">
              <p className="adm-overview-label">{item.label}</p>
              <p className="adm-overview-value">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Recent Blog Posts</h2>
          <Link href="/admin/blog" className="adm-panel-link">
            Manage All Blogs
          </Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {recentBlogPosts.map((row) => (
                <tr key={row.title}>
                  <td>{row.title}</td>
                  <td>{row.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Recent Testimonials</h2>
          <Link href="/admin/testimonials" className="adm-panel-link">
            Manage All Testimonials
          </Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {recentTestimonials.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.rating}</td>
                  <td>{row.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h2 className="adm-panel-title">Recent Courses</h2>
          <Link href="/admin/courses" className="adm-panel-link">
            Manage All Courses
          </Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Level</th>
                <th>Date Created</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((row) => (
                <tr key={row.title}>
                  <td>{row.title}</td>
                  <td>{row.level}</td>
                  <td>{row.dateCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

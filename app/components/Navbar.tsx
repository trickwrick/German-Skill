import Link from "next/link";
import { navItems } from "../../data/siteNavigation";

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function GlobeLogo() {
  return (
    <svg className="logo-globe" width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
      <circle cx="26" cy="26" r="24" fill="#2563eb" />
      <ellipse cx="26" cy="26" rx="10" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
      <path
        d="M4 20h44M4 32h44M8 14c6 4 30 4 36 0M8 38c6-4 30-4 36 0"
        stroke="#fff"
        strokeWidth="1.2"
        opacity="0.75"
        fill="none"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="logo-block">
          <GlobeLogo />
          <div className="logo-text">
            <strong>GermanSkill</strong>
            <span>Sprich Deutsch mit Vertrauen</span>
          </div>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <ul className="main-nav-list">
            {navItems.map((item) => (
              <li key={item.label} className={item.dropdown ? "has-dropdown" : undefined}>
                <Link href={item.href}>
                  {item.label}
                  {item.dropdown ? <ChevronDown /> : null}
                </Link>
                {item.dropdown && item.items ? (
                  <ul className="dropdown-menu">
                    {item.items.map((sub) => {
                      const label = typeof sub === "string" ? sub : sub.label;
                      const href = typeof sub === "string" ? item.href : sub.href;

                      return (
                        <li key={label}>
                          <Link href={href}>{label}</Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href="/contact" className="nav-contact-link">
            Contact Us
          </Link>
        </nav>

        <div className="header-actions">
          <Link href="/#login" className="btn btn-outline">
            Student Login
          </Link>
          <Link href="/contact" className="btn btn-primary">
            Free Demo Class
          </Link>
        </div>
      </div>
    </header>
  );
}

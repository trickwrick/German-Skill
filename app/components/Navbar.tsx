"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems } from "../../data/siteNavigation";
import SiteLogo from "./SiteLogo";
import TopAnnouncementBar from "./TopAnnouncementBar";

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleResize() {
      if (window.innerWidth > 960) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  function toggleDropdown(label: string) {
    setOpenDropdown((current) => (current === label ? null : label));
  }

  return (
    <div className="site-header-wrap">
      <TopAnnouncementBar />
      <header className={`site-header${menuOpen ? " nav-open" : ""}`}>
      <div className="site-header-inner">
        <Link href="/" className="logo-block" onClick={closeMenu}>
          <SiteLogo priority />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="site-header-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>

        <div id="site-header-menu" className="header-menu">
          <nav className="main-nav" aria-label="Main navigation">
            <ul className="main-nav-list">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={`${item.dropdown ? "has-dropdown" : ""}${
                    openDropdown === item.label ? " is-open" : ""
                  }`.trim()}
                >
                  {item.dropdown ? (
                    <>
                      <Link href={item.href} className="nav-desktop-link" onClick={closeMenu}>
                        {item.label}
                        <ChevronDown />
                      </Link>
                      <button
                        type="button"
                        className="nav-mobile-trigger"
                        aria-expanded={openDropdown === item.label}
                        onClick={() => toggleDropdown(item.label)}
                      >
                        {item.label}
                        <ChevronDown />
                      </button>
                    </>
                  ) : (
                    <Link href={item.href} onClick={closeMenu}>
                      {item.label}
                    </Link>
                  )}
                  {item.dropdown && item.items ? (
                    <ul className="dropdown-menu">
                      {item.items.map((sub) => {
                        const label = typeof sub === "string" ? sub : sub.label;
                        const href = typeof sub === "string" ? item.href : sub.href;

                        return (
                          <li key={label}>
                            <Link href={href} onClick={closeMenu}>
                              {label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="nav-contact-link" onClick={closeMenu}>
              Contact Us
            </Link>
          </nav>

          <div className="header-actions">
            <Link href="/contact" className="btn btn-primary" onClick={closeMenu}>
              Free Demo Class
            </Link>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
}

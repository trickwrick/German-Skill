export const courseLevels = [
  { label: "German Level A1", href: "/courses/a1" },
  { label: "German Level A2", href: "/courses/a2" },
  { label: "German Level B1", href: "/courses/b1" },
  { label: "German Level B2", href: "/courses/b2" },
  { label: "German Level C1", href: "/courses/c1" },
  { label: "German Level C2", href: "/courses/c2" },
];

export const aboutLinks = [
  { label: "Our Company", href: "/about/our-company" },
  { label: "Our Faculties", href: "/about/our-faculties" },
  { label: "Career", href: "/about/careers" },
  { label: "FAQs", href: "/about/faqs" },
];

export const navItems = [
  {
    label: "Courses",
    href: "/#courses",
    dropdown: true,
    items: courseLevels,
  },
  {
    label: "About",
    href: "/#about",
    dropdown: true,
    items: aboutLinks,
  },
  { label: "Blog", href: "/blog", dropdown: false },
];

export const usefulLinks = [
  { label: "About", href: "/#about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blogs", href: "/blog" },
  { label: "FAQs", href: "/about/faqs" },
];

export const footerLegalLinks = [
  { label: "Terms & Conditions", href: "/#terms" },
  { label: "Privacy Policy", href: "/#privacy" },
  { label: "Refund Policy", href: "/#refund" },
];

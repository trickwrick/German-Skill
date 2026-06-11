import { germanCourses, getCourseHref } from "./germanCourses";

export const courseLevels = germanCourses.map((course) => ({
  label: `German Level ${course.slug.toUpperCase()}`,
  href: getCourseHref(course),
}));

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

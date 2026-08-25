import { germanCourses, getCourseHref } from "./germanCourses";
import { showFaqs } from "./siteFeatures";

export const courseLevels = germanCourses.map((course) => ({
  label: `German Level ${course.slug.toUpperCase()}`,
  href: getCourseHref(course),
}));

const allAboutLinks = [
  { label: "Our Company", href: "/about/our-company" },
  { label: "Our Faculties", href: "/about/our-faculties" },
  { label: "Apply Job", href: "/about/apply-job" },
  { label: "FAQs", href: "/about/faqs" },
];

export const aboutLinks = showFaqs
  ? allAboutLinks
  : allAboutLinks.filter((link) => link.href !== "/about/faqs");

export const navItems = [
  {
    label: "Courses",
    href: "/courses",
    dropdown: false,
  },
  {
    label: "About",
    href: "/about/our-company",
    dropdown: true,
    items: aboutLinks,
  },
  { label: "Blog", href: "/blogs", dropdown: false },
];

const allUsefulLinks = [
  { label: "About", href: "/about/our-company" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
  { label: "FAQs", href: "/about/faqs" },
];

export const usefulLinks = showFaqs
  ? allUsefulLinks
  : allUsefulLinks.filter((link) => link.href !== "/about/faqs");

export const footerLegalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
];

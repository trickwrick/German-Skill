export type AdminStatCard = {
  id: string;
  label: string;
  value: string;
  theme: "blue" | "green" | "purple" | "amber" | "sky";
};

export type AdminOverviewStat = {
  label: string;
  value: string;
};

export type AdminBlogRow = {
  title: string;
  dateCreated: string;
};

export type AdminTestimonialRow = {
  name: string;
  rating: string;
  dateCreated: string;
};

export type AdminCourseRow = {
  title: string;
  level: string;
  dateCreated: string;
};

export const adminStatCards: AdminStatCard[] = [
  { id: "courses", label: "Courses", value: "6", theme: "blue" },
  { id: "blogs", label: "Blog Posts", value: "3", theme: "green" },
  { id: "testimonials", label: "Testimonials", value: "8", theme: "purple" },
  { id: "students", label: "Students", value: "124", theme: "amber" },
  { id: "rating", label: "Average Rating", value: "4.9", theme: "sky" },
];

export const adminOverviewStats: AdminOverviewStat[] = [
  { label: "Total Blogs", value: "3" },
  { label: "Total Testimonials", value: "8" },
  { label: "Total Courses", value: "6" },
];

export const recentBlogPosts: AdminBlogRow[] = [
  {
    title: "How to Prepare for Goethe A1 Exam in 30 Days",
    dateCreated: "2026-05-12",
  },
  {
    title: "Study in Germany: Language Requirements Explained",
    dateCreated: "2026-04-28",
  },
  {
    title: "Online vs Offline German Classes — Which Is Better?",
    dateCreated: "2026-04-15",
  },
];

export const recentTestimonials: AdminTestimonialRow[] = [
  { name: "Priya Sharma", rating: "5/5", dateCreated: "2026-05-20" },
  { name: "Rahul Mehta", rating: "5/5", dateCreated: "2026-05-18" },
  { name: "Ananya Gupta", rating: "4/5", dateCreated: "2026-05-10" },
  { name: "Vikram Singh", rating: "5/5", dateCreated: "2026-05-02" },
  { name: "Sneha Patel", rating: "5/5", dateCreated: "2026-04-25" },
];

export const recentCourses: AdminCourseRow[] = [
  { title: "German Level A1", level: "Beginner", dateCreated: "2026-01-10" },
  { title: "German Level A2", level: "Elementary", dateCreated: "2026-01-10" },
  { title: "German Level B1", level: "Intermediate", dateCreated: "2026-01-12" },
  { title: "German Level B2", level: "Upper Intermediate", dateCreated: "2026-01-12" },
];

export const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Courses", href: "/admin/courses", icon: "courses" },
  { label: "City Pages", href: "/admin/city-pages", icon: "city" },
  { label: "Blog", href: "/admin/blog", icon: "blog" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
  { label: "Queries", href: "/admin/queries", icon: "queries" },
] as const;

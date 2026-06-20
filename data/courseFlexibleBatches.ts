export type CourseBatchOption = {
  id: string;
  date: string;
  dayType: string;
  schedule: string;
  time: string;
  soldOut?: boolean;
  defaultSelected?: boolean;
};

export type CourseFlexibleBatches = {
  subtitle: string;
  highlight: string;
  title: string;
  batches: CourseBatchOption[];
  originalPrice: string;
  badge: string;
  discountPercent: number;
};

const sharedBatches: CourseBatchOption[] = [
  {
    id: "batch-1",
    date: "June 8th",
    dayType: "Weekdays",
    schedule: "MON - FRI (1 Month)",
    time: "06:00PM to 07:30PM (IST)",
    soldOut: true,
  },
  {
    id: "batch-2",
    date: "June 22nd",
    dayType: "Weekdays",
    schedule: "MON - FRI (1 Month)",
    time: "06:00PM to 07:30PM (IST)",
  },
  {
    id: "batch-3",
    date: "July 6th",
    dayType: "Weekdays",
    schedule: "MON - FRI (1 Month)",
    time: "06:00PM to 07:30PM (IST)",
    defaultSelected: true,
  },
];

function buildBatchContent(
  levelLabel: string,
  salePrice: string,
  originalPrice: string,
): CourseFlexibleBatches {
  return {
    subtitle: `Get Certification in ${levelLabel} German Language Course Online Live Training with`,
    highlight: "Goethe Exam Preparation",
    title: "Flexible batches for you",
    batches: sharedBatches,
    originalPrice,
    badge: "Live Classes + Study Material Included",
    discountPercent: 50,
  };
}

export const courseFlexibleBatches: Record<string, CourseFlexibleBatches> = {
  a1: buildBatchContent("A1 Level", "₹14,999", "₹29,998"),
  a2: buildBatchContent("A2 Level", "₹17,500", "₹35,000"),
  b1: buildBatchContent("B1 Level", "₹21,000", "₹42,000"),
  b2: buildBatchContent("B2 Level", "₹21,000", "₹42,000"),
  c1: buildBatchContent("C1 Level", "₹20,500", "₹41,000"),
  c2: buildBatchContent("C2 Level", "₹23,500", "₹47,000"),
};

export function getCourseFlexibleBatches(slug: string) {
  return courseFlexibleBatches[slug] ?? courseFlexibleBatches.a1;
}

export type ComparisonRow = {
  feature: string;
  fluentAuf: boolean;
  others: boolean;
};

export const homeComparison = {
  title: "How are we different from others?",
  brandName: "Fluent AUF",
  competitorName: "Live Class Platform",
  rows: [
    { feature: "Affordability", fluentAuf: true, others: false },
    { feature: "Learning Flexibility", fluentAuf: true, others: false },
    { feature: "Doubt Solving", fluentAuf: true, others: true },
    { feature: "Personal Mentorship", fluentAuf: true, others: false },
    { feature: "Dedicated Goal", fluentAuf: true, others: true },
    { feature: "Certified Tutor", fluentAuf: true, others: false },
  ] satisfies ComparisonRow[],
};

export const courseLevelLabels: Record<string, string> = {
  a1: "Beginner",
  a2: "Elementary",
  b1: "Intermediate",
  b2: "Upper Intermediate",
  c1: "Advanced",
  c2: "Proficient",
};

export const courseLevelOptions = [
  { value: "a1", label: "A1 — Beginner" },
  { value: "a2", label: "A2 — Elementary" },
  { value: "b1", label: "B1 — Intermediate" },
  { value: "b2", label: "B2 — Upper Intermediate" },
  { value: "c1", label: "C1 — Advanced" },
  { value: "c2", label: "C2 — Proficient" },
] as const;

export function getCourseLevelLabel(slug: string) {
  return courseLevelLabels[slug.toLowerCase()] ?? slug.toUpperCase();
}

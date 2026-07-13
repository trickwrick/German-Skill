export function slugifyHomeFaqId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sortHomeFaqItems<T extends { sortOrder: number; question: string }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.question.localeCompare(b.question));
}

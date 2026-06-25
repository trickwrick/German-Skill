export function slugifyCoursePath(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDisplayPrice(price: string) {
  const cleaned = price.replace(/â‚¹/g, "₹").trim();
  if (cleaned.includes("₹")) {
    return cleaned.replace(/\.00$/, "");
  }

  const numeric = Number(cleaned.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) {
    return price;
  }

  const formatted = numeric.toLocaleString("en-IN", {
    minimumFractionDigits: numeric % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `₹${formatted}`;
}

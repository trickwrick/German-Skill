export const CITY_PAGE_SLUG_PREFIX = "german-classes-in-";

export function slugifyCitySlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalize admin/public input to the stored city key (e.g. "delhi"). */
export function normalizeCitySlug(value: string) {
  let cleaned = slugifyCitySlug(value);
  if (cleaned.startsWith("german-classes-in-")) {
    cleaned = cleaned.slice("german-classes-in-".length);
  } else if (cleaned.startsWith("german-classes-")) {
    cleaned = cleaned.slice("german-classes-".length);
  }
  return cleaned.replace(/^-+|-+$/g, "");
}

/** Public path segment like "german-classes-in-delhi". */
export function cityPagePathSlug(slug: string) {
  const city = normalizeCitySlug(slug);
  return city ? `${CITY_PAGE_SLUG_PREFIX}${city}` : "";
}

/** Public href like "/german-classes-in-delhi". */
export function buildCityPagePath(slug: string) {
  const pathSlug = cityPagePathSlug(slug);
  return pathSlug ? `/${pathSlug}` : "/city";
}

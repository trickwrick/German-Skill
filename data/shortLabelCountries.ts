import { defaultCountries } from "react-international-phone";
import type { CountryData } from "react-international-phone";

export const shortLabelCountries: CountryData[] = defaultCountries.map((country) => {
  const [, iso2, ...rest] = country;
  return [iso2.toUpperCase(), iso2, ...rest] as CountryData;
});

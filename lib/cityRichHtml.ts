export function applyCityPlaceholder(html: string, cityName: string) {
  if (!html) {
    return "";
  }

  return html.replace(/\{city\}/gi, cityName);
}

export function hasRichHtmlMarkup(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

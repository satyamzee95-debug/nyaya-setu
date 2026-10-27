export function formatDate(value, locale = "en-IN") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

export function formatDocumentType(value) {
  return value?.replaceAll("_", " ").toLowerCase() ?? "";
}

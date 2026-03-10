/**
 * Form utility functions for data cleaning and formatting.
 */

/**
 * Trims leading/trailing whitespace from all string values in form data.
 * @param {Record<string, unknown>} data - Form data object
 * @returns {Record<string, unknown>} Trimmed form data
 */
export function trimFormData(data) {
  if (!data || typeof data !== "object") return data;

  const trimmed = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      trimmed[key] = value.trim();
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      trimmed[key] = trimFormData(value);
    } else {
      trimmed[key] = value;
    }
  }
  return trimmed;
}

/**
 * Converts a string to title case.
 * @param {string} str - String to convert
 * @returns {string} Title-cased string
 */
export function toTitleCase(str) {
  if (!str || typeof str !== "string") return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

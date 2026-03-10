/**
 * Agent/entity utilities - Labels, formatting.
 * Extend with project-specific agent types and formatters.
 */

/**
 * @param {string} type
 * @returns {string}
 */
export function getAgentTypeLabel(type) {
  return type ? String(type).replace(/_/g, " ") : "";
}

/**
 * @param {number} price
 * @param {string} [currency='USD']
 * @returns {string}
 */
export function formatPrice(price, currency = "USD") {
  if (price == null || isNaN(price)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

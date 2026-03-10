/**
 * User utilities - User display helpers.
 */

/**
 * @param {Object} user
 * @returns {string|null}
 */
export function getUserEntityId(user) {
  return user?.id ?? null;
}

/**
 * @param {Object} user
 * @returns {string}
 */
export function getUserDisplayName(user) {
  if (!user) return "";
  if (user.name) return user.name;
  if (user.email) return user.email;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`.trim();
  return "Unknown";
}

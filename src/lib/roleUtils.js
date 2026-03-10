/**
 * Role utilities - User role checks and helpers.
 * Extend with project-specific roles.
 */

/**
 * @param {Object} user
 * @returns {boolean}
 */
export function isUserAdmin(user) {
  return user?.role === "admin";
}

/**
 * @param {Object} user
 * @returns {string|null}
 */
export function getUserPrimaryRole(user) {
  return user?.role ?? null;
}

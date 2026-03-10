/**
 * Toast message constants for consistent user feedback.
 * Use these instead of hardcoding messages.
 */

export const SUCCESS = {
  CREATE: (entity) => `${entity} created successfully.`,
  UPDATE: (entity) => `${entity} updated successfully.`,
  DELETE: (entity) => `${entity} deleted successfully.`,
};

export const ERROR = {
  CREATE: (entity) => `Failed to create ${entity}.`,
  UPDATE: (entity) => `Failed to update ${entity}.`,
  DELETE: (entity) => `Failed to delete ${entity}.`,
  FETCH: (entity) => `Failed to fetch ${entity}.`,
};

export const WARNING = {
  UNSAVED_CHANGES: "You have unsaved changes.",
};

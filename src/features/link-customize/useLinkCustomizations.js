import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_SETTINGS, DEFAULT_CUSTOMIZATION_ID, STORAGE_KEY } from "./constants";

/**
 * Link customizations, kept in this browser only (demo, no backend).
 *
 * Each customization has a draft the editor changes and a published copy that
 * "Publish changes" replaces. A customization that was never published has
 * published = null.
 */

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

/** Fill sections or fields added after a customization was saved. */
function withDefaults(settings) {
  if (!settings) return settings;
  const out = {};
  for (const [section, defaults] of Object.entries(DEFAULT_SETTINGS)) {
    out[section] = { ...defaults, ...(settings[section] ?? {}) };
  }
  return out;
}

function makeItem(name, settings, published = null) {
  return {
    id: `c_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name,
    draft: clone(settings),
    published: clone(published),
    publishedAt: published ? Date.now() : null,
  };
}

const INITIAL_ITEMS = {
  [DEFAULT_CUSTOMIZATION_ID]: {
    id: DEFAULT_CUSTOMIZATION_ID,
    name: "default",
    draft: clone(DEFAULT_SETTINGS),
    published: clone(DEFAULT_SETTINGS),
    publishedAt: null,
  },
};

export const useLinkCustomizations = create(
  persist(
    (set, get) => ({
      currentId: DEFAULT_CUSTOMIZATION_ID,
      items: INITIAL_ITEMS,

      select: (id) => {
        if (get().items[id]) set({ currentId: id });
      },

      /** Merge `patch` into one section of the current draft. */
      update: (section, patch) =>
        set((state) => {
          const item = state.items[state.currentId];
          return {
            items: {
              ...state.items,
              [item.id]: {
                ...item,
                draft: { ...item.draft, [section]: { ...item.draft[section], ...patch } },
              },
            },
          };
        }),

      publish: () =>
        set((state) => {
          const item = state.items[state.currentId];
          return {
            items: {
              ...state.items,
              [item.id]: { ...item, published: clone(item.draft), publishedAt: Date.now() },
            },
          };
        }),

      /** Throw away draft edits. A never-published customization goes back to the defaults. */
      discard: () =>
        set((state) => {
          const item = state.items[state.currentId];
          return {
            items: {
              ...state.items,
              [item.id]: { ...item, draft: clone(item.published ?? DEFAULT_SETTINGS) },
            },
          };
        }),

      create: (name) => {
        const item = makeItem(name, DEFAULT_SETTINGS);
        set((state) => ({ items: { ...state.items, [item.id]: item }, currentId: item.id }));
        return item.id;
      },

      duplicate: (name) => {
        const source = get().items[get().currentId];
        const item = makeItem(name, source.draft);
        set((state) => ({ items: { ...state.items, [item.id]: item }, currentId: item.id }));
        return item.id;
      },

      rename: (name) =>
        set((state) => {
          const item = state.items[state.currentId];
          return { items: { ...state.items, [item.id]: { ...item, name } } };
        }),

      remove: () =>
        set((state) => {
          if (state.currentId === DEFAULT_CUSTOMIZATION_ID) return state;
          const items = { ...state.items };
          delete items[state.currentId];
          return { items, currentId: DEFAULT_CUSTOMIZATION_ID };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentId: state.currentId, items: state.items }),
      merge: (persisted, current) => {
        if (!persisted?.items) return current;
        const items = {};
        for (const [id, item] of Object.entries(persisted.items)) {
          items[id] = { ...item, draft: withDefaults(item.draft), published: withDefaults(item.published) };
        }
        if (!items[DEFAULT_CUSTOMIZATION_ID]) items[DEFAULT_CUSTOMIZATION_ID] = INITIAL_ITEMS[DEFAULT_CUSTOMIZATION_ID];
        const currentId = items[persisted.currentId] ? persisted.currentId : DEFAULT_CUSTOMIZATION_ID;
        return { ...current, items, currentId };
      },
    }
  )
);

export function sectionChanged(item, section) {
  if (!item.published) return true;
  return JSON.stringify(item.draft[section]) !== JSON.stringify(item.published[section]);
}

export function isDirty(item) {
  if (!item.published) return true;
  return JSON.stringify(item.draft) !== JSON.stringify(item.published);
}

/** Validates a customization name against the others. Returns an error message or null. */
export function nameError(name, items, ignoreId) {
  const trimmed = name.trim();
  if (!trimmed) return "Enter a name.";
  if (trimmed.length > 40) return "Keep it to 40 characters or fewer.";
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(trimmed)) return "Use letters, numbers, dashes and underscores only.";
  const taken = Object.values(items).some(
    (it) => it.id !== ignoreId && it.name.toLowerCase() === trimmed.toLowerCase()
  );
  return taken ? "Another customization already has this name." : null;
}

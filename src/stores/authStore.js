import { create } from "zustand";
import api from "@/lib/api";

function getInitialState() {
  try {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("authUser");
    if (token && userStr) {
      return { user: JSON.parse(userStr), isAuthenticated: true };
    }
  } catch {
    // ignore parse errors
  }
  return { user: null, isAuthenticated: false };
}

function persistUser(user) {
  if (user) localStorage.setItem("authUser", JSON.stringify(user));
}

export const useAuthStore = create((set, get) => ({
  ...getInitialState(),
  login: (userData, token) => {
    if (token) localStorage.setItem("authToken", token);
    persistUser(userData);
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    set({ user: null, isAuthenticated: false });
  },
  refreshProfile: async () => {
    try {
      const res = await api.get("/profile");
      const user = res.data?.data?.user;
      if (user) {
        persistUser(user);
        set({ user, isAuthenticated: true });
      }
      return user;
    } catch {
      return get().user;
    }
  },
  enableDeveloperMode: async () => {
    const res = await api.post("/profile/developer-mode");
    const user = res.data?.data?.user;
    if (user) {
      persistUser(user);
      set({ user });
    }
    return user;
  },
}));

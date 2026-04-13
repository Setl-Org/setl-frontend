import { create } from "zustand";

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

export const useAuthStore = create((set) => ({
  ...getInitialState(),
  login: (userData, token) => {
    if (token) localStorage.setItem("authToken", token);
    if (userData) localStorage.setItem("authUser", JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    set({ user: null, isAuthenticated: false });
  },
}));

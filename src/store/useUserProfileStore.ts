import { create } from "zustand";
import { ProfileData } from "@/types/userData";

type UserStore = {
  user: ProfileData | null;
  setUser: (user: ProfileData) => void;
  updateUser: (updatedData: Partial<ProfileData>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  updateUser: (updatedData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedData } : null,
    })),

  clearUser: () => set({ user: null }),
}));

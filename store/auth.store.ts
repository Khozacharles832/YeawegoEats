import { supabase } from "@/lib/supabase";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: (options?: {
    preserveSessionOnError?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (value) => set({ isLoading: value }),

  // 🔥 Get current authenticated user
  fetchAuthenticatedUser: async (options = {}) => {
    console.log("FETCH START");

    set({ isLoading: true });

    const clearAuthState = () => {
      if (options.preserveSessionOnError) {
        set((state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }));
        return;
      }

      set({ isAuthenticated: false, user: null });
    };

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log("AUTH USER:", user, error);

      if (error || !user) {
        console.log("NO AUTH USER");
        clearAuthState();
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("PROFILE:", profile, profileError);

      set({
        isAuthenticated: true,
        user: profile ?? null,
      });

      console.log("AUTH SUCCESS");
    } catch (e) {
      console.log("ERROR:", e);
      clearAuthState();
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔐 Logout
  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log("Logout error", e);
    } finally {
      set({ isAuthenticated: false, user: null });
    }
  },
}));

export default useAuthStore;

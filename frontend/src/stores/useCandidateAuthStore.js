import { create } from "zustand";
import authService from "../services/authService";

const STORAGE_KEYS = {
    TOKEN: "topcv_candidate_token",
    USER: "topcv_candidate_user"
};

const getInitialUser = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEYS.USER);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const initialToken = localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
const initialUser = getInitialUser();

export const useCandidateAuthStore = create((set) => ({
    token: initialToken,
    user: initialUser,
    isAuthenticated: !!initialToken,
    isLoading: false,
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const res = await authService.login({ email, password });
            const accessToken = res.access_token;
            const authUser = res.user;

            localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));

            set({
                token: accessToken,
                user: authUser,
                isAuthenticated: true,
            });

            return { success: true, user: authUser };
        } finally {
            set({ isLoading: false });
        }
    },

    register: async ({ email, password, full_name }) => {
        set({ isLoading: true });
        try {
            const res = await authService.registerCandidate({ email, password, full_name });
            const accessToken = res.access_token;
            const authUser = res.user;

            localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));

            set({
                token: accessToken,
                user: authUser,
                isAuthenticated: true,
            });

            return { success: true, user: authUser };
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.warn("Candidate logout error:", err);
        } finally {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            set({
                token: null,
                user: null,
                isAuthenticated: false
            });
        }
    }
}));

export const useCandidateAuth = useCandidateAuthStore;
export default useCandidateAuthStore;

import { create } from "zustand";
import authService from "../services/authService";
import companyService from "../services/companyService";
import employerService from "../services/employerService";

const STORAGE_KEYS = {
    TOKEN: "topcv_employer_token",
    USER: "topcv_employer_user",
    COMPANY: "topcv_employer_company",
    JOBS: "topcv_employer_created_jobs"
};

const getStoredJSON = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

const initialToken = localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
const initialUser = getStoredJSON(STORAGE_KEYS.USER, null);
const initialCompany = getStoredJSON(STORAGE_KEYS.COMPANY, null);
const storedJobs = getStoredJSON(STORAGE_KEYS.JOBS, []);
const initialJobs = (Array.isArray(storedJobs) ? storedJobs : []).filter(
    (job) => !String(job?.id || "").startsWith("sample-job-")
);

export const useEmployerAuthStore = create((set, get) => ({
    token: initialToken,
    user: initialUser,
    company: initialCompany,
    employerJobs: initialJobs,
    isAuthenticated: !!initialToken,
    isLoading: false,

    login: async (email, password, registeredCompany = null) => {
        set({ isLoading: true });
        try {
            const res = await authService.login({ email, password });
            const accessToken = res.access_token;
            const authUser = res.user;

            localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authUser));
            localStorage.removeItem(STORAGE_KEYS.JOBS);

            let compData = registeredCompany
                ? {
                    company_name: registeredCompany.company_name,
                    tax_code: registeredCompany.tax_code,
                    email: registeredCompany.email,
                    short_name: registeredCompany.short_name,
                }
                : null;

            if (!compData?.company_name) {
                try {
                    const companyRes = await companyService.getCompanies({ page: 1 });
                    const companies = Array.isArray(companyRes?.data)
                        ? companyRes.data
                        : [];
                    const normalizedEmail = String(authUser.email || email).toLowerCase();
                    compData = companies.find(
                        (company) => String(company.email || "").toLowerCase() === normalizedEmail,
                    ) || null;
                } catch (companyError) {
                    console.warn("Không thể tải thông tin công ty sau khi đăng nhập:", companyError);
                }
            }

            compData = compData || {
                company_name: authUser.full_name || "",
                email: authUser.email || email || "",
            };
            localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(compData));

            set({
                token: accessToken,
                user: authUser,
                company: compData,
                employerJobs: [],
                isAuthenticated: true
            });

            return { success: true, user: authUser };
        } finally {
            set({ isLoading: false });
        }
    },

    registerCompany: async (companyData) => {
        set({ isLoading: true });
        try {
            await companyService.registerCompany(companyData);
            const loginRes = await get().login(
                companyData.email,
                companyData.password,
                companyData,
            );
            return loginRes;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.warn("Employer logout notice:", err);
        } finally {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.COMPANY);
            localStorage.removeItem(STORAGE_KEYS.JOBS);
            set({
                token: null,
                user: null,
                company: null,
                employerJobs: [],
                isAuthenticated: false
            });
        }
    },

    addJob: async (jobPayload) => {
        let createdJob;
        try {
            createdJob = await employerService.createJob(jobPayload);
        } catch (err) {
            console.error("Backend job creation failed:", err);
            throw err;
        }

        set((state) => {
            const updatedJobs = [createdJob, ...state.employerJobs];
            localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updatedJobs));
            return { employerJobs: updatedJobs };
        });

        return createdJob;
    },

}));

export const useEmployerAuth = useEmployerAuthStore;
export default useEmployerAuthStore;

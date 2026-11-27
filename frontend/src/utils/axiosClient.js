import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: attach bearer token if available
axiosClient.interceptors.request.use(
    (config) => {
        console.info("[API request started]", {
            method: config.method?.toUpperCase(),
            url: `${config.baseURL || ""}${config.url || ""}`,
        });

        if (!config.headers.Authorization) {
            const candidateToken = localStorage.getItem("topcv_candidate_token");
            const employerToken = localStorage.getItem("topcv_employer_token");
            
            const url = config.url || "";
            let token;

            if (url.startsWith("/employer")) {
                token = employerToken || candidateToken;
            } else if (url.startsWith("/candidate") || url.includes("/apply")) {
                token = candidateToken || employerToken;
            } else {
                token = candidateToken || employerToken;
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isCanceled = axios.isCancel(error) || error.code === "ERR_CANCELED";
        console.error(isCanceled ? "[API request canceled]" : "[API request failed]", {
            method: error.config?.method?.toUpperCase(),
            url: `${error.config?.baseURL || ""}${error.config?.url || ""}`,
            status: error.response?.status,
            code: error.code,
            message: error.response?.data?.message || error.message,
        });
        return Promise.reject(error);
    }
);

export default axiosClient;

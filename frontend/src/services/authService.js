import axiosClient from "../utils/axiosClient";

export const authService = {
    login: async ({ email, password }) => {
        try {
            const response = await axiosClient.post("/auth/login", { email, password });
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.detail || error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
            throw new Error(msg, { cause: error });
        }
    },

    registerCandidate: async (data) => {
        try {
            const response = await axiosClient.post("/auth/register", data);
            return response.data;
        } catch (error) {
            const msg = error.response?.data?.detail || error.response?.data?.message || "Đăng ký thất bại.";
            throw new Error(msg, { cause: error });
        }
    },

    logout: async () => {
        try {
            await axiosClient.post("/auth/logout");
        } catch (error) {
            console.warn("Logout API notice:", error);
        } finally {
            localStorage.removeItem("topcv_employer_token");
            localStorage.removeItem("topcv_employer_user");
            localStorage.removeItem("topcv_employer_company");
        }
    },
};

export default authService;

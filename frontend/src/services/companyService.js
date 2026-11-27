import axiosClient from "../utils/axiosClient";

export const companyService = {
    registerCompany: async (data) => {
        const response = await axiosClient.post("/companies/register", data);
        return response.data;
    },

    getCompanies: async (params = {}) => {
        const response = await axiosClient.get("/companies", { params });
        return response.data;
    },
};

export default companyService;

import axiosClient from "../utils/axiosClient";

export const categoryService = {
    getCategories: async () => {
        const response = await axiosClient.get("/categories");
        return response.data;
    }
};

export default categoryService;

import axiosClient from "../utils/axiosClient";

const employerService = {
    createJob: async (jobData) => {
        const response = await axiosClient.post("/employer/jobs", jobData);
        return response.data;
    },
};

export default employerService;

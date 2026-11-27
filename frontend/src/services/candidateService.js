import axiosClient from "../utils/axiosClient";

export const candidateService = {
    getJobs: async (params = {}) => {
        const response = await axiosClient.get("/jobs", { params });
        return response.data;
    },

    getJobBySlug: async (slug) => {
        const response = await axiosClient.get(`/jobs/${slug}`);
        return response.data;
    },

    getMyCvs: (userId = null) => {
        try {
            const key = userId
                ? `topcv_candidate_saved_cvs_${userId}`
                : "topcv_candidate_saved_cvs";
            const local =
                localStorage.getItem(key) ||
                localStorage.getItem("topcv_candidate_saved_cvs");
            return local ? JSON.parse(local) : [];
        } catch {
            return [];
        }
    },

    createCv: async (data, userId = null) => {
        // Gọi API backend có sẵn: POST /api/v1/candidate/cvs
        const response = await axiosClient.post("/candidate/cvs", data);
        const cvId = response.data?.cv_id;

        try {
            const key = userId
                ? `topcv_candidate_saved_cvs_${userId}`
                : "topcv_candidate_saved_cvs";
            const prev = JSON.parse(
                localStorage.getItem(key) ||
                    localStorage.getItem("topcv_candidate_saved_cvs") ||
                    "[]",
            );
            const cvItem = {
                id: cvId || data.id || `cv_${Date.now()}`,
                ...data,
                updated_at: new Date().toISOString(),
            };
            const updated = [cvItem, ...prev.filter((c) => c.id !== cvItem.id)];
            localStorage.setItem(key, JSON.stringify(updated));
            localStorage.setItem(
                "topcv_candidate_saved_cvs",
                JSON.stringify(updated),
            );
        } catch (e) {
            console.warn("Local storage cache error:", e);
        }

        return response.data;
    },

    applyJob: async (jobId, payload) => {
        const response = await axiosClient.post(
            `/jobs/${jobId}/apply`,
            payload,
        );
        return response.data;
    },
};

export default candidateService;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import employerService from "../services/employerService";
import useEmployerAuthStore from "../stores/useEmployerAuthStore";

export const useCreateEmployerJob = () => {
    const queryClient = useQueryClient();
    const addJobToStore = useEmployerAuthStore((s) => s.addJob);

    return useMutation({
        mutationFn: async (jobData) => {
            const created = await employerService.createJob(jobData);
            return created;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            if (data) {
                addJobToStore(data);
            }
        },
    });
};

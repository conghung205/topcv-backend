import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import candidateService from "../services/candidateService";

export const useJobs = (params = {}) => {
    return useQuery({
        queryKey: ["jobs", params],
        queryFn: () => candidateService.getJobs(params),
    });
};

export const useJobDetail = (slug) => {
    return useQuery({
        queryKey: ["job", slug],
        queryFn: () => candidateService.getJobBySlug(slug),
        enabled: Boolean(slug),
    });
};

export const useMyCvs = (userId = null) => {
    return useQuery({
        queryKey: ["my-cvs", userId],
        queryFn: () => candidateService.getMyCvs(userId),
    });
};

export const useCreateCv = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, userId }) => candidateService.createCv(data, userId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["my-cvs", variables?.userId] });
        },
    });
};

export const useApplyJob = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ jobId, payload }) => candidateService.applyJob(jobId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["job", variables?.jobId] });
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
        },
    });
};

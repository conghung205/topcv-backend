import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import companyService from "../services/companyService";

export const useCompanies = (params = {}) => {
    return useQuery({
        queryKey: ["companies", params],
        queryFn: () => companyService.getCompanies(params),
    });
};

export const useRegisterCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => companyService.registerCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
};

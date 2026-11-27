import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import useCandidateAuthStore from "../stores/useCandidateAuthStore";
import useEmployerAuthStore from "../stores/useEmployerAuthStore";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }) => authService.login({ email, password }),
    });
};

export const useRegisterCandidate = () => {
    return useMutation({
        mutationFn: (data) => authService.registerCandidate(data),
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const candidateLogout = useCandidateAuthStore((s) => s.logout);
    const employerLogout = useEmployerAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: async () => {
            await authService.logout();
            await candidateLogout();
            await employerLogout();
        },
        onSuccess: () => {
            queryClient.clear();
        },
    });
};

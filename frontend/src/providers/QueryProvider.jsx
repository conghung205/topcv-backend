import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Reuse cached data for 2 minutes before considering it stale.
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 10,
            retry: 0,
            // Refetch on mount only when the cached query is stale.
            refetchOnMount: true,
            refetchOnWindowFocus: false,
        },
    },
});

export default function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

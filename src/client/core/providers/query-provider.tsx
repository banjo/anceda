import { Toast } from "@/client/core/utils/toast";
import { ApiError } from "@/models/api-error";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: Error) => {
            Toast.error(error);
            if (ApiError.isApiError(error)) {
                console.error(error);
            } else {
                console.error(error);
            }
        },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: true,
        },
        mutations: {
            onError: (error: Error) => {
                Toast.error(error);
            },
        },
    },
});

type Props = PropsWithChildren & {};
export const QueryProvider = ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

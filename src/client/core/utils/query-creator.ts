import { queryClient } from "@/client/core/providers/query-provider";
import { useQuery, UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";

type Options<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;

export function createQuery<T>(props: { keyFn: () => string[]; queryFn: () => Promise<T> }): {
    query: (opts?: Options<T>) => ReturnType<typeof useQuery<T>>;
    suspenseQuery: (opts?: Options<T>) => ReturnType<typeof useSuspenseQuery<T>>;
    ensure: () => Promise<T>;
    key: () => string[];
};

export function createQuery<Args, T>(props: {
    keyFn: (args: Args) => string[];
    queryFn: (args: Args) => Promise<T>;
}): {
    query: (args: Args, opts?: Options<T>) => ReturnType<typeof useQuery<T>>;
    suspenseQuery: (args: Args, opts?: Options<T>) => ReturnType<typeof useSuspenseQuery<T>>;
    ensure: (args: Args) => Promise<T>;
    key: (args: Args) => string[];
};

export function createQuery<Args, T>(props: any) {
    const { keyFn, queryFn } = props;

    if (keyFn.length === 0) {
        return {
            query: (opts?: Options<T>) =>
                useQuery({
                    queryKey: keyFn(),
                    queryFn: () => queryFn(),
                    ...opts,
                }),
            suspenseQuery: (opts?: Options<T>) =>
                useSuspenseQuery({
                    queryKey: keyFn(),
                    queryFn: () => queryFn(),
                    ...opts,
                }),
            ensure: async () =>
                await queryClient.ensureQueryData({
                    queryKey: keyFn(),
                    queryFn: () => queryFn(),
                }),
            key: () => keyFn(),
        };
    }

    return {
        query: (args: Args, opts?: Options<T>) =>
            useQuery({
                queryKey: keyFn(args),
                queryFn: () => queryFn(args),
                ...opts,
            }),
        suspenseQuery: (args: Args, opts?: Options<T>) =>
            useSuspenseQuery({
                queryKey: keyFn(args),
                queryFn: () => queryFn(args),
                ...opts,
            }),
        ensure: async (args: Args) =>
            await queryClient.ensureQueryData({
                queryKey: keyFn(args),
                queryFn: () => queryFn(args),
            }),
        key: (args: Args) => keyFn(args),
    };
}

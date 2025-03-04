import { PropsWithChildren, ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type SuspenseLoaderProps = PropsWithChildren & {
    loadingFallback?: ReactNode;
    errorFallback?: ReactNode;
};

export const SuspenseLoader = ({
    children,
    loadingFallback = <div>Loading...</div>,
    errorFallback = <div>Something went wrong. Please try again later.</div>,
}: SuspenseLoaderProps) => (
    <ErrorBoundary
        fallback={typeof errorFallback === "function" ? errorFallback : <>{errorFallback}</>}
    >
        <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
);

import {
    AsyncTryExpressionResult,
    createTryExpressionResult,
    TryExpressionResult,
} from "@banjoanton/utils";

export const Result = createTryExpressionResult();
export type ResultType<T = undefined> = TryExpressionResult<T>;
export type AsyncResultType<T = undefined> = AsyncTryExpressionResult<T>;

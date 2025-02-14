import { createResultWithType, ResultWithType } from "@banjoanton/utils";

type ErrorType =
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "INTERNAL_SERVER_ERROR"
    | "BAD_REQUEST";

export const Result = createResultWithType<ErrorType>();
export type ResultType<T = undefined> = ResultWithType<T, ErrorType>;
export type AsyncResultType<T = undefined> = Promise<ResultType<T>>;

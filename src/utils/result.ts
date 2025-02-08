import { createResult, ResultType as RT } from "@banjoanton/utils";

export const Result = createResult();
export type ResultType<T> = RT<T>;
export type AsyncResultType<T> = Promise<ResultType<T>>;

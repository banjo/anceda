import { ApiError } from "@/models/api-error";
import { ControllerErrorData } from "@/server/api/controller-model";
import { isDefined, sleep, to } from "@banjoanton/utils";
import { InferResponseType } from "hono";
import { ClientResponse } from "hono/client";

const queryByClient = async <T, TResponse extends () => Promise<ClientResponse<T>>>(
    callback: TResponse
): Promise<Awaited<InferResponseType<TResponse, 200>>> => {
    const res = await callback();
    if (res.status !== 200) {
        const errorData: ControllerErrorData = (await res.json()) as ControllerErrorData;
        if (res.status === 404) {
            throw new ApiError(errorData.message, "NOT_FOUND");
        } else if (res.status === 401) {
            throw new ApiError(errorData.message, "UNAUTHORIZED");
        } else if (res.status === 403) {
            throw new ApiError(errorData.message, "FORBIDDEN");
        } else {
            throw new ApiError(errorData.message, "INTERNAL_SERVER_ERROR");
        }
    }
    return (await res.json()) as Awaited<InferResponseType<TResponse, 200>>;
};

const defaultOptions = { retries: 3, delay: 800 };
const queryWithErrorHandling = async <T, TResponse extends () => Promise<ClientResponse<T>>>(
    callback: TResponse,
    options?: { retries?: number; delay?: number }
) => {
    const maxRetries = options?.retries ?? defaultOptions.retries;
    let attempt = 1;
    let result = await to(() => queryByClient(callback));
    const error = result[0];

    if (!isDefined(error)) {
        return result;
    }

    while (attempt < maxRetries) {
        await sleep(options?.delay ?? defaultOptions.delay);
        result = await to(() => queryByClient(callback));
        const data = result[1];
        if (data) {
            return result;
        }
        attempt++;
    }

    return result;
};

export const FetchService = { queryByClient, queryWithErrorHandling };

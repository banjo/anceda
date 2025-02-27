import { createContextLogger } from "@/utils/context-logger";
import { ResultType } from "@/utils/result";
import { Context } from "hono";
import { JSONValue } from "hono/utils/types";

export type ControllerErrorData = {
    message: string;
    meta?: Record<string, unknown>;
};

export type ControllerErrorDataWithSuccessInfo = ControllerErrorData & {
    success: false;
};

const decorateWithSuccessFalse = (
    data: ControllerErrorData
): ControllerErrorDataWithSuccessInfo => ({
    ...data,
    success: false,
});

const logger = createContextLogger("controller-model");

export const SuccessResponse = <TData extends JSONValue | void>(c: Context, data: TData) =>
    c.json(data ? data : { success: true }, 200);
export const ErrorResponse = (c: Context, data: ControllerErrorData) =>
    c.json(decorateWithSuccessFalse(data), 500);
export const NotFoundResponse = (c: Context, data: ControllerErrorData) =>
    c.json(decorateWithSuccessFalse(data), 404);
export const UnauthorizedResponse = (c: Context, data: ControllerErrorData) =>
    c.json(decorateWithSuccessFalse(data), 401);
export const ForbiddenResponse = (c: Context, data: ControllerErrorData) =>
    c.json(decorateWithSuccessFalse(data), 403);

export const createResponseFromResult = <T extends JSONValue | void>(
    res: ResultType<T>,
    c: Context
) => {
    if (res.ok) {
        logger.info("Successfully handled request");
        return SuccessResponse(c, res.data);
    }

    logger.error({ message: res.message, status: res.type }, "Request failed");
    switch (res.type) {
        case "NOT_FOUND":
            return NotFoundResponse(c, decorateWithSuccessFalse({ message: res.message }));
        case "UNAUTHORIZED":
            return UnauthorizedResponse(c, decorateWithSuccessFalse({ message: res.message }));
        case "FORBIDDEN":
            return ForbiddenResponse(c, decorateWithSuccessFalse({ message: res.message }));
        default:
            return ErrorResponse(c, decorateWithSuccessFalse({ message: res.message }));
    }
};

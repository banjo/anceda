import { getApiContext } from "@/server/api/context";
import { createContextLogger } from "@/utils/context-logger";
import { Result, ResultType } from "@/utils/result";
import { Context } from "hono";
import { JSONValue } from "hono/utils/types";

export type ControllerErrorDataBase = {
    message: string;
    meta?: Record<string, unknown>;
};

export type ControllerErrorData = ControllerErrorDataBase & {
    success: false;
    requestId: string;
};

const decorate = (data: ControllerErrorDataBase): ControllerErrorData => {
    const context = getApiContext();
    return {
        ...data,
        success: false,
        requestId: context.requestId,
    };
};

const logger = createContextLogger("controller-model");

export const SuccessResponse = <TData extends JSONValue>(c: Context, data: TData) =>
    c.json(data, 200);
export const ErrorResponse = (c: Context, data: ControllerErrorDataBase) =>
    c.json(decorate(data), 500);
export const NotFoundResponse = (c: Context, data: ControllerErrorDataBase) =>
    c.json(decorate(data), 404);
export const UnauthorizedResponse = (c: Context, data: ControllerErrorDataBase) =>
    c.json(decorate(data), 401);
export const ForbiddenResponse = (c: Context, data: ControllerErrorDataBase) =>
    c.json(decorate(data), 403);

export const createResponseFromResult = <T extends JSONValue>(c: Context, res: ResultType<T>) => {
    if (res.ok) {
        logger.info("Successfully handled request");

        return SuccessResponse(c, res.data);
    }

    logger.error({ message: res.message, status: res.type }, "Request failed");
    switch (res.type) {
        case "NOT_FOUND":
            return NotFoundResponse(c, decorate({ message: res.message }));
        case "UNAUTHORIZED":
            return UnauthorizedResponse(c, decorate({ message: res.message }));
        case "FORBIDDEN":
            return ForbiddenResponse(c, decorate({ message: res.message }));
        default:
            return ErrorResponse(c, decorate({ message: res.message }));
    }
};

export const createResponseFromVoidResult = (c: Context, _: ResultType<void>) =>
    createResponseFromResult(c, Result.ok({ success: true }));

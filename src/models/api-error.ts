import { ErrorType, Result } from "@/utils/result";

export class ApiError extends Error {
    public type: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message);
        this.name = this.constructor.name;
        this.type = type;
        Error.captureStackTrace(this, this.constructor);
    }

    static isApiError = (error: Error): error is ApiError => error instanceof ApiError;

    static isType = (error: Error, type: ErrorType): boolean =>
        ApiError.isApiError(error) && error.type === type;
}

export const createResultFromApiError = (error: Error) => {
    if (ApiError.isType(error, "BAD_REQUEST")) {
        return Result.error(error.message, "BAD_REQUEST");
    } else if (ApiError.isType(error, "NOT_FOUND")) {
        return Result.error(error.message, "NOT_FOUND");
    } else if (ApiError.isType(error, "UNAUTHORIZED")) {
        return Result.error(error.message, "UNAUTHORIZED");
    } else if (ApiError.isType(error, "FORBIDDEN")) {
        return Result.error(error.message, "FORBIDDEN");
    }

    return Result.error(error.message, "INTERNAL_SERVER_ERROR");
};

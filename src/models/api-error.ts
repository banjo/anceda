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
    if (ApiError.isApiError(error)) {
        return Result.error(error.message, error.type);
    }

    return Result.error(error.message, "INTERNAL_SERVER_ERROR");
};

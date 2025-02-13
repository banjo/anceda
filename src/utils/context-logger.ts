import { getApiContext } from "@/server/api/context";
import { createLogger } from "@/utils/logger";
import { invariant } from "@banjoanton/utils";
import pino from "pino";

type Level = pino.Level;
type LogFnWithString = (msg: string, ...args: unknown[]) => void;
type LogFnWithObject = (obj: object, msg: string, ...args: unknown[]) => void;
type LogFn = LogFnWithString & LogFnWithObject;

type Logger = {
    [key in Level]: LogFn;
};

const getContextBase = () => {
    const context = getApiContext();
    return {
        userId: context.user?.id ?? undefined,
        requestId: context.requestId,
    };
};

class ContextLogger implements Logger {
    private logger: pino.Logger;

    constructor(name: string) {
        this.logger = createLogger(name);
    }

    private handle(level: Level, objOrMsg: object | string, ...args: unknown[]) {
        const base = getContextBase();

        if (typeof objOrMsg === "string") {
            this.logger[level]({ ...base, ...args }, objOrMsg);
            return;
        }

        const [msg, ...restArgs] = args;
        invariant(typeof msg === "string", "Expected message to be a string");
        this.logger[level]({ ...objOrMsg, ...base, ...restArgs }, msg);
    }

    public trace(objOrMsg: object | string, ...args: unknown[]): void {
        this.handle("trace", objOrMsg, ...args);
    }

    public debug(objOrMsg: object | string, ...args: unknown[]): void {
        this.handle("debug", objOrMsg, ...args);
    }

    public info(objOrMsg: object | string, ...args: unknown[]): void {
        this.handle("info", objOrMsg, ...args);
    }

    public warn(objOrMsg: object | string, ...args: unknown[]): void {
        this.handle("warn", objOrMsg, ...args);
    }

    public error(objOrMsg: object | string, ...args: unknown[]): void {
        this.handle("error", objOrMsg, ...args);
    }

    public fatal(objOrMsg: object | string, ...args: unknown[]): void {
        this.handle("fatal", objOrMsg, ...args);
    }
}

export const createContextLogger = (name: string): Logger => new ContextLogger(name);

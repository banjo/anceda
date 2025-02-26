import { Hono } from "hono";
import { User } from "../../models/user";
import { adminMiddleware } from "../core/middleware/admin-middleware";
import { authMiddleware } from "../core/middleware/auth-middleware";

export type ApiAuthorizedInstance = {
    Variables: {
        user: User;
        requestId: string;
    };
};

export type ApiPublicInstance = {
    Variables: {
        requestId: string;
    };
};

export const createPublicApiInstance = () => new Hono<ApiPublicInstance>();
export const createAuthorizedApiInstance = () =>
    new Hono<ApiAuthorizedInstance>().use(authMiddleware);
export const createAdminApiInstance = () =>
    new Hono<ApiAuthorizedInstance>().use(authMiddleware).use(adminMiddleware);

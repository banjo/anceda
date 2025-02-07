import { Hono } from "hono";
import { User } from "../core/models/user";
import { adminMiddleware } from "../core/middleware/admin-middleware";
import { authMiddleware } from "../core/middleware/auth-middleware";

export type ApiAuthorizedInstance = {
    Variables: {
        user: User;
    };
};

export type ApiPublicInstance = {
    Variables: {};
};

export const createPublicApiInstance = () => new Hono<ApiPublicInstance>();
export const createAuthorizedApiInstance = () =>
    new Hono<ApiAuthorizedInstance>().use(authMiddleware);
export const createAdminApiInstance = () =>
    new Hono<ApiAuthorizedInstance>().use(authMiddleware).use(adminMiddleware);

import { Env } from "@/utils/env";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, roles } from "../access-control";

const env = Env.client();

export const authClient = createAuthClient({
    baseURL: env.VITE_SERVER_URL,
    plugins: [
        organizationClient({
            ac,
            roles,
        }),
        adminClient(),
    ],
});

export type AuthSession = typeof authClient.$Infer.Session.session;
export type AuthUser = typeof authClient.$Infer.Session.user;

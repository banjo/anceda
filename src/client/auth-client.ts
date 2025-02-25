import { Env } from "@/utils/env";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const env = Env.client();

export const authClient = createAuthClient({
    baseURL: env.VITE_SERVER_URL,
    plugins: [adminClient()],
});

export type AuthSession = typeof authClient.$Infer.Session.session;
export type AuthUser = typeof authClient.$Infer.Session.user;

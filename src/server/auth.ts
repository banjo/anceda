import { Config } from "@/config";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization } from "better-auth/plugins";

import { ac, roles } from "../access-control";

const prisma = new PrismaClient();
export const auth = betterAuth({
    plugins: [
        organization({
            ac,
            roles,
        }),
        admin(),
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    // databaseHooks: {},
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        crossSubDomainCookies: { enabled: true },
        generateId: false, // database does this automatically
    },
    trustedOrigins: Config.trustedOrigins,
});

export type ApiUser = typeof auth.$Infer.Session.user;
export type ApiSession = typeof auth.$Infer.Session.session;

import { Config } from "@/config";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, organization } from "better-auth/plugins";

import { ac } from "../access-control";

const prisma = new PrismaClient();
export const auth = betterAuth({
    plugins: [
        organization({
            ac,
        }),
        admin(),
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        crossSubDomainCookies: { enabled: true },
    },
    trustedOrigins: Config.trustedOrigins,
});

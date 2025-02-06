import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { Config } from "@/config";
import { organization } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
    plugins: [organization()],
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

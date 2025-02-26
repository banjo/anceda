import { Config } from "@/config";
import { prisma } from "@/db";
import { UserService } from "@/server/core/services/user-service";
import { createContextLogger } from "@/utils/context-logger";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession } from "better-auth/plugins";

const logger = createContextLogger("auth");

export const auth = betterAuth({
    plugins: [
        admin(),
        customSession(async ({ user, session }) => {
            const orgResult = await UserService.getActiveOrganization(user.id);

            if (!orgResult.ok) {
                logger.error({ message: orgResult.message }, "Failed to get active organization");
                throw new Error("Failed to get active organization");
            }

            return {
                user: {
                    ...user,
                    organizationId: orgResult.data.id,
                    organizationRole: orgResult.data.role,
                },
                session,
            };
        }),
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

export type CustomApiUserData = {
    organizationId: string;
    organizationRole: string;
};

export type ApiUser = typeof auth.$Infer.Session.user & CustomApiUserData;

export type ApiSession = typeof auth.$Infer.Session.session;

export type ApiFullSession = {
    user: ApiUser;
    session: ApiSession;
};

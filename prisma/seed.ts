import { prisma } from "@/db";
import { OrganizationRole, UserRole } from "@/models/role";
import { auth } from "@/server/auth";
import { OrganizationType } from "@prisma/client";

async function main() {
    const user = await prisma.user.create({
        data: {
            email: "test@test.com",
            name: "test",
            emailVerified: true,
            role: UserRole.ADMIN,
        },
    });

    const ctx = await auth.$context;
    const password = await ctx.password.hash("123qweASD");

    await prisma.account.create({
        data: {
            accountId: "test",
            providerId: "credential",
            password,
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });

    await prisma.organization.create({
        data: {
            id: "anceda",
            name: "anceda",
            slug: "anceda",
            type: OrganizationType.PRIMARY,
            invitedOrganizations: {
                create: {
                    name: "secondary",
                    type: OrganizationType.SECONDARY,
                },
            },
        },
    });

    await prisma.member.create({
        data: {
            id: "test-user",
            role: OrganizationRole.PRIMARY_OWNER,
            organizationId: "anceda",
            userId: user.id,
        },
    });

    console.log("Done with seed!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
        return process.exit(0);
    })
    .catch(async error => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });

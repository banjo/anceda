import { prisma } from "@/db";
import { Role } from "../src/server/core/models/role";
import { OrganizationType } from "@prisma/client";

async function main() {
    const user = await prisma.user.create({
        data: {
            email: "test@test.com",
            name: "test",
            emailVerified: true,
            role: Role.ADMIN,
        },
    });

    await prisma.account.create({
        data: {
            accountId: "test",
            providerId: "credential",
            // password: "123qweASD"
            password:
                "8361b75a124f348683a83f583bef7e3a:133bf6f26d7991c2cacf56945649dc82e7b86f48124afec5eba39a6e02586a5d73dc541f317de68e047ecc768c24915a816dcf1130a5901e34e04fa2f894baa3",
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
            type: OrganizationType.Primary,
        },
    });

    await prisma.member.create({
        data: {
            id: "test-user",
            role: "superAdmin",
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

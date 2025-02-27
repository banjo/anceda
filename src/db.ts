import { to } from "@banjoanton/utils";
import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type PrismaTransactionalClient = Prisma.TransactionClient;

export type DbOptions = {
    prisma: PrismaTransactionalClient;
};

export const defaultDbOptions: DbOptions = {
    prisma,
};

export const createTransaction = async <TData>(
    prisma: PrismaClient,
    callback: (tx: Prisma.TransactionClient) => Promise<TData>
) => await to(async () => prisma.$transaction(async tx => await callback(tx)));

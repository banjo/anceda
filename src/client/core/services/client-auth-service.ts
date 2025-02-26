import { authClient } from "@/client/auth-client";
import { AsyncResultType, Result } from "@/utils/result";

export type SignInProps = {
    email: string;
    password: string;
};

const signIn = async ({ email, password }: SignInProps): AsyncResultType => {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
    });

    if (error) {
        return Result.error(error.message ?? "Could not sign in", "UNAUTHORIZED");
    }

    return Result.ok();
};

const signOut = async (): AsyncResultType => {
    const { data, error } = await authClient.signOut();

    if (error) {
        return Result.error(error.message ?? "Could not sign out", "INTERNAL_SERVER_ERROR");
    }

    console.log({ data });

    return Result.ok();
};

export const ClientAuthService = { signIn, signOut };

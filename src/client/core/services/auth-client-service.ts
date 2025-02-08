import { redirect } from "@tanstack/react-router";
import { authClient } from "../../auth-client";

export type SignInProps = {
    email: string;
    password: string;
};

const signIn = async ({ email, password }: SignInProps) => {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
    });

    // TODO: error check and fetch user data, get active organization, etc.

    await authClient.organization.setActive({ organizationSlug: "anceda" });
};

const signOut = async () => {
    const { data, error } = await authClient.signOut();

    console.log({ data });

    // TODO: error check
};

export const AuthClientService = { signIn, signOut };

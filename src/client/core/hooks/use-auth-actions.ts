import { useAuth } from "@/client/core/providers/auth-provider";
import { AuthClientService, SignInProps } from "@/client/core/services/auth-client-service";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

/**
 * Provides actions for authentication. Due to Tanstack Router, the auth context cannot
 * handle navigation as it is defined before the router is instanciated.
 */
export const useAuthActions = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const signIn = useCallback(async (props: SignInProps) => {
        auth.handleSignIn();
        await AuthClientService.signIn(props);
        await navigate({ to: "/dashboard" });
    }, []);

    const signOut = useCallback(async () => {
        auth.handleSignOut();
        await AuthClientService.signOut();
        await navigate({ to: "/" });
    }, []);

    return { signIn, signOut };
};

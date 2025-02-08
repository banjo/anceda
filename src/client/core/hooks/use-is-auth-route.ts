import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../providers/auth-provider";

/**
 * Redirects the user to the home page if they are not authenticated.
 */
export const useIsAuthRoute = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isPending && !auth.isAuthenticated) {
            navigate({ to: "/" });
        }
    }, [auth, navigate]);
};

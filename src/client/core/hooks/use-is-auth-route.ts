import { useAuth } from "@/client/core/providers/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

/**
 * Redirects the user to the home page if they are not authenticated.
 */
export const useIsAuthRoute = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isPending && !auth.isAuthenticated) {
            console.log("Redirecting to home page");
            navigate({ to: "/" });
        }
    }, [auth, navigate]);
};

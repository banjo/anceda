import { useAuth } from "@/client/core/providers/auth-provider";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const useForceOverview = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (!auth.isPending && auth.isAuthenticated && pathname === "/dashboard") {
            navigate({ to: "/dashboard/overview" });
        }
    }, [auth, navigate]);
};

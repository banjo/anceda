import { useAuth } from "@/client/core/providers/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const useForceDashboardIfAuth = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isPending && auth.isAuthenticated) {
            navigate({ to: "/dashboard" });
        }
    }, [auth, navigate]);
};

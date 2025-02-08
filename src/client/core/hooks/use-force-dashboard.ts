import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "../providers/auth-provider";

export const useForceDashboardIfAuth = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isPending && auth.isAuthenticated) {
            navigate({ to: "/dashboard" });
        }
    }, [auth, navigate]);
};

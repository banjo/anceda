import { isDefined, noop } from "@banjoanton/utils";
import { BetterFetchError } from "better-auth/react";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { authClient, AuthSession, AuthUser } from "../../auth-client";

type AuthBase = {
    isPending: boolean;
    error?: BetterFetchError;
    handleSignOut: () => void;
    handleSignIn: () => void;
};

type AuthenticatedResult = {
    isAuthenticated: true;
    user: AuthUser;
    session: AuthSession;
};

type UnauthenticatedResult = {
    isAuthenticated: false;
    user: undefined;
    session: undefined;
};

export type AuthData = AuthBase & (AuthenticatedResult | UnauthenticatedResult);

const defaultAuthData: AuthData = {
    isAuthenticated: false,
    user: undefined,
    session: undefined,
    isPending: false,
    handleSignOut: noop,
    handleSignIn: noop,
};

const AuthContext = createContext<AuthData>(defaultAuthData);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const auth = authClient.useSession();
    const hasSession = isDefined(auth?.data?.session?.token);
    const [allowAuthentication, setAllowAuthentication] = useState(true);

    const handleSignOut = () => {
        setAllowAuthentication(false);
    };

    const handleSignIn = () => {
        setAllowAuthentication(true);
    };

    // this allows for instant sign out, a problem with better auth and tanstack router together (https://github.com/better-auth/better-auth/issues/1009)
    const isAuthenticatedLocally = useMemo(() => {
        if (hasSession && !allowAuthentication) {
            return false;
        }

        return hasSession;
    }, [hasSession, allowAuthentication]);

    const isAuthenticated = isAuthenticatedLocally ? hasSession : false;

    const base: AuthBase = useMemo(
        () => ({
            isPending: auth.isPending,
            error: auth.error ?? undefined,
            handleSignOut,
            handleSignIn,
        }),
        [auth.isPending, auth.error]
    );

    const authData = auth?.data ?? undefined;
    const contextValue: AuthData = useMemo(() => {
        if (isAuthenticated && authData) {
            return {
                isAuthenticated: true,
                user: authData.user,
                session: authData.session,
                ...base,
            };
        }

        return {
            isAuthenticated: false,
            user: undefined,
            session: undefined,
            ...base,
        };
    }, [isAuthenticated, authData, base]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

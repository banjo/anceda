import { isDefined, noop } from "@banjoanton/utils";
import { BetterFetchError } from "better-auth/react";
import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
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

    const isAuthenticated = isDefined(auth?.data?.user.id) ?? false;
    const [signedOut, setSignedOut] = useState(() => !isAuthenticated);

    const handleSignOut = () => {
        setSignedOut(true);
    };

    const handleSignIn = () => {
        setSignedOut(false);
    };

    const base: AuthBase = useMemo(
        () => ({
            isPending: auth.isPending,
            error: auth.error ?? undefined,
            handleSignOut,
            handleSignIn,
        }),
        [auth.isPending, auth.error]
    );

    // this allows instant sign out
    const authData = signedOut ? undefined : auth?.data;

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

    console.log({ contextValue });

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

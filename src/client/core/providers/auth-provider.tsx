import { BetterFetchError } from "better-auth/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { authClient, AuthSession, AuthUser } from "../../auth-client";
import { AuthClientService, SignInProps } from "../services/auth-client-service";
import { isDefined } from "@banjoanton/utils";

type AuthBase = {
    isPending: boolean;
    error?: BetterFetchError;
    signIn: (props: SignInProps) => Promise<void>;
    signOut: () => Promise<void>;
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

export type AuthHookResult = AuthBase & (AuthenticatedResult | UnauthenticatedResult);

const defaultAuthHooksResult: AuthHookResult = {
    isAuthenticated: false,
    user: undefined,
    session: undefined,
    isPending: false,
    signIn: AuthClientService.signIn,
    signOut: AuthClientService.signOut,
};

const AuthContext = createContext<AuthHookResult>(defaultAuthHooksResult);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: PropsWithChildren) => {
    const session = authClient.useSession();

    const base: AuthBase = {
        isPending: session.isPending,
        error: session.error ?? undefined,
        signIn: AuthClientService.signIn,
        signOut: AuthClientService.signOut,
    };

    const isAuthenticated = isDefined(session?.data?.user.id) ?? false;
    const sessionData = session?.data;

    let contextValue: AuthHookResult = defaultAuthHooksResult;

    if (isAuthenticated && sessionData) {
        contextValue = {
            isAuthenticated: true,
            user: sessionData.user,
            session: sessionData.session,
            ...base,
        };
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

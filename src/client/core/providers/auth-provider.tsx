import { authClient } from "@/client/auth-client";
import { ClientAuthService, SignInProps } from "@/client/core/services/client-auth-service";
import { ApiFullSession, ApiSession, ApiUser } from "@/server/auth";
import { User } from "@/server/core/models/user";
import { AsyncResultType, Result } from "@/utils/result";
import { isDefined, Maybe } from "@banjoanton/utils";
import { BetterFetchError } from "better-auth/react";
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

type AuthBase = {
    isPending: boolean;
    error?: BetterFetchError;
    signIn: (props: SignInProps) => AsyncResultType<void>;
    signOut: () => AsyncResultType<void>;
};

type AuthenticatedResult = {
    isAuthenticated: true;
    user: User;
    session: ApiSession;
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
    signIn: () => Promise.resolve(Result.ok()),
    signOut: () => Promise.resolve(Result.ok()),
};

const AuthContext = createContext<AuthData>(defaultAuthData);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const auth = authClient.useSession();
    const [allowAuthentication, setAllowAuthentication] = useState(true);
    const hasSession = isDefined(auth?.data?.session?.token);

    const signIn = useCallback(async (props: SignInProps) => {
        setAllowAuthentication(true);
        return await ClientAuthService.signIn(props);
    }, []);

    const signOut = useCallback(async () => {
        setAllowAuthentication(false);
        return await ClientAuthService.signOut();
    }, []);

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
            signIn,
            signOut,
        }),
        [auth.isPending, auth.error, signIn, signOut]
    );

    const data = auth?.data as unknown as Maybe<ApiFullSession>; // correct type is not inferred by better-auth
    const contextValue: AuthData = useMemo(() => {
        if (isAuthenticated && data) {
            return {
                isAuthenticated: true,
                user: User.fromApiSession(data),
                session: data.session,
                ...base,
            };
        }

        return {
            isAuthenticated: false,
            user: undefined,
            session: undefined,
            ...base,
        };
    }, [isAuthenticated, data, base]);

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const Languages = {
    en: "en",
    sv: "sv",
} as const;
export type Language = keyof typeof Languages;

type Leaf = {
    [key in Language]: string;
};

export type LangTree = {
    [key: string]: Leaf | LangTree;
};

export const languageContent: LangTree = {
    index: {
        login: {
            title: {
                en: "Login",
                sv: "Logga in",
            },
            email: {
                en: "Email",
                sv: "E-post",
            },
            password: {
                en: "Password",
                sv: "Lösenord",
            },
            login: {
                en: "Login",
                sv: "Inloggning",
            },
            logIn: {
                en: "Log in",
                sv: "Logga in",
            },
            loggingIn: {
                en: "Logging in",
                sv: "Loggar in",
            },
            description: {
                en: "Enter your email and password to log in",
                sv: "Ange din e-postadress och lösenord för att logga in",
            },
        },
    },
};

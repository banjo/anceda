import { Alert, AlertDescription } from "@/client/components/ui/alert";
import { Button } from "@/client/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/client/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/client/components/ui/form";
import { Input } from "@/client/components/ui/input";
import { useAuth } from "@/client/core/providers/auth-provider";
import { AuthLogin, AuthLoginSchema } from "@/models/auth-login";
import { Env } from "@/utils/env";
import { Maybe } from "@banjoanton/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const LoginContainer = () => {
    const { t } = useTranslation();
    const env = Env.client();

    const form = useForm<AuthLogin>({
        resolver: zodResolver(AuthLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [error, setError] = useState<Maybe<string>>();
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }: AuthLogin) => {
        setIsLoading(true);
        setError(undefined);

        const res = await signIn({
            email,
            password,
        });

        if (!res.ok) {
            setError(res.message);
            setIsLoading(false);
            return;
        }

        await navigate({ to: "/dashboard/overview" });
        setIsLoading(false);
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{t("index.login.login")}</CardTitle>
                <CardDescription>{t("index.login.description")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid w-full items-center gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("index.login.email")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("index.login.password")}</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {error ? (
                            <Alert variant="destructive" className="mt-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : null}
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" type="submit" form="login-form" disabled={isLoading}>
                    {isLoading ? t("index.login.loggingIn") : t("index.login.logIn")}
                </Button>

                {env.DEV ? (
                    <Button
                        className="w-full"
                        onClick={async () =>
                            onSubmit({
                                email: "test@test.com",
                                password: "123qweASD",
                            })
                        }
                    >
                        Admin login
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
};

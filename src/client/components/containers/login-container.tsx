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
import { useAuthActions } from "@/client/core/hooks/use-auth-actions";
import { AuthLogin, AuthLoginSchema } from "@/models/auth-login";
import { Maybe } from "@banjoanton/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const LoginContainer = () => {
    const form = useForm<AuthLogin>({
        resolver: zodResolver(AuthLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [error, setError] = useState<Maybe<string>>();
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuthActions();
    const navigate = useNavigate();

    const onSubmit = async (values: AuthLogin) => {
        setIsLoading(true);
        setError(undefined);

        await signIn({
            email: "test@test.com",
            password: "123qweASD",
        });

        await navigate({ to: "/dashboard" });

        setIsLoading(false);
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email and password to log in</CardDescription>
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
                                        <FormLabel>Email</FormLabel>
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
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
            <CardFooter>
                <Button className="w-full" type="submit" form="login-form" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in"}
                </Button>
            </CardFooter>
        </Card>
    );
};

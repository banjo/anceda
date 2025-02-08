import { useState } from "react";
import { useAuthActions } from "../../core/hooks/use-auth-actions";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

// TODO: update this
export function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuthActions();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

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
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>
                    {error ? (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : null}
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    type="submit"
                    form="login-form"
                    disabled={isLoading}
                    onClick={handleSubmit}
                >
                    {isLoading ? "Logging in..." : "Log in"}
                </Button>
            </CardFooter>
        </Card>
    );
}

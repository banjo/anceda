import { z } from "zod";

export const AuthLoginSchema = z.object({
    email: z.string().min(3, { message: "Email must be at least 3 characters long" }),
    password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
});

export type AuthLogin = z.infer<typeof AuthLoginSchema>;

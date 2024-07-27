import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({ message: 'Name is required.' })
        .min(3, { message: "Name must be 3 characters long." }),
    email: z.string({ message: 'Email is required.' })
        .email({ message: "Name must be 3 characters long." }),
    password: z.string({ message: 'Password is required' })
        .min(6, { message: 'Password must be 6 characters long.' }),
    confirmPassword: z.string({ message: 'Confirm Password is required' })
        .min(6, { message: 'Confirm Password must be 6 characters long.' }),
})
    .refine((data) => data.password === data.confirmPassword,
        {
            message: 'Passwords do not match.',
            path: ["confirmPassword"]
        })

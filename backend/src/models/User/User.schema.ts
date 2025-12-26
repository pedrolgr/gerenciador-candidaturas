import { z } from 'zod';

export const UserBody = z.object({
    fullName: z.string().min(5).max(30)
    .transform((val) => {
        return val
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }),
    email: z.email()
    .transform((val) => {
        return val.trim().toLowerCase();
    }),
    password: z.string().min(8).max(14)
})

export type UserType = z.infer<typeof UserBody>;
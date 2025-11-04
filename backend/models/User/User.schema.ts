import { z } from 'zod';

export const UserBody = z.object({
    name: z.string().min(5).max(30),
    username: z.string().min(5).max(12),
    email: z.email(),
    password: z.string().min(8).max(14)
})

export type UserType = z.infer<typeof UserBody>;
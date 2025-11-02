import { z } from 'zod';

export const UserBody = z.object({
    name: z.string().min(5).max(30),
    username: z.string().min(5).max(12),
    email: z.string(),
    password: z.string().min(8).max(14)
})
import { z } from 'zod';

export const UserCredentialsBody = z.object({
    username: z.string().min(5).max(12),
    password: z.string().min(8).max(14)
})

export type UserCredentialsType = z.infer<typeof UserCredentialsBody>;
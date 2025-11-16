import { z } from 'zod';

export const signInSchema = z.object({
    email: z
    .email("Digite um e-mail válido")
    .max(30),

    password: z
    .string()
    .max(14, "A senha deve ter no máximo 14 caracteres")
})

export type SignInType = z.infer<typeof signInSchema>;
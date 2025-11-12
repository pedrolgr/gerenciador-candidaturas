import { z } from 'zod';

export const signUpSchema = z.object({
    fullName: z
    .string()
    .min(8, "Seu nome deve ter no mínimo 8 caracteres")
    .max(30, "Seu nome deve ter no máximo 30 caracteres"),

    email: z
    .email("Digite um e-mail válido"),

    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(14, "A senha deve ter no máximo 14 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número"),

    passwordConfirmation: z.string()
})
.refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não conferem",
    path: ["passwordConfirmation"],
  })


export type SignUpType = z.infer<typeof signUpSchema>;
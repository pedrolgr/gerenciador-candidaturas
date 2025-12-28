import axios from "axios"
import { redirect, useNavigate } from "react-router";
import dotenv from 'dotenv';
import { useForm, Controller, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signUpSchema, type SignUpType } from "./SignupSchema"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";

export function Signup() {

    const navigate = useNavigate();

    const form = useForm<SignUpType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    })

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<SignUpType> = async (data) => {

        const newUser = {
            fullName: data.fullName,
            email: data.email,
            password: data.password
        }

        try {
            const response = await axios.post("http://localhost:3000/api/signup", newUser)
            console.log(response)
            toast.success("Conta criada com sucesso!");
            navigate("/jobdashboard")
        } catch (error: any) {
            const message = error.response?.data?.message || "Erro inesperado ao criar conta.";
            toast.error(message);
            console.error("Signup error", error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Crie sua conta</CardTitle>
                    <CardDescription>
                        Digite seu e-mail e sua senha abaixo para criar sua conta.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="fullName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Nome Completo
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="fullNameInput"
                                            type="text"
                                            placeholder="Digite seu nome completo"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            E-mail
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="emailInput"
                                            type="text"
                                            placeholder="Digite o seu e-mail"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Senha
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="passwordInput"
                                            type="password"
                                            placeholder="Digite sua senha"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="passwordConfirmation"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Confirme sua senha
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="passwordConfirmationInput"
                                            type="password"
                                            placeholder="Confirme sua senha"
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="grid gap-2 w-full">
                        <Button type="submit" form="signup-form" className="w-full cursor-pointer">
                            Criar Conta
                        </Button>
                        <Button type="submit" variant="outline" disabled className="w-full">
                            Crie sua Conta com Google
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>

    )
}
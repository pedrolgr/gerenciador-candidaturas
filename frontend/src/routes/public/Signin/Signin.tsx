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
import { signInSchema, type SignInType } from "./SigninSchema"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod"



export function Signin() {

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { handleSubmit } = form;

    const validateUser = async () => {
        
        try{
            const token = await axios.get("/api/auth", {withCredentials: true})
            
            return {isValid: true,
                    user: token.data.user
                }

        } catch (err) {

            return {isValid: false}
        }

    }

    const onSubmit: SubmitHandler<SignInType> = async (data) => {

        const loginCredentials = {
            email: data.email,
            password: data.password
        }

        try {
            const response = await axios.post("/api/signin", loginCredentials, {withCredentials: true});
            
            if((await validateUser()).isValid) navigate("/jobdashboard")
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Criar o componente para exibir na tela o erro durante cadastro do usuario
            } else {
                // Criar componente pra exibr na tela o a exceção inesperada
            }
        }
            
        
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Digite seu e-mail e sua senha abaixo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
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
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <div className="grid gap-2 w-full">
                        <Button type="submit" form="signup-form" className="w-full cursor-pointer">
                            Login
                        </Button>
                        <Button type="submit" variant="outline" disabled className="w-full">
                            Login via Google
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>

    )
}
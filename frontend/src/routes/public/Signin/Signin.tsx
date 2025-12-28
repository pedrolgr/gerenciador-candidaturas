import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
// import dotenv from 'dotenv'; // Not used in frontend usually like this
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
import { toast } from "sonner"


export function Signin() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { handleSubmit } = form;


    const onSubmit: SubmitHandler<SignInType> = async (data) => {
        try {
            const loginCredentials = {
                email: data.email,
                password: data.password
            }

            // Using context for login
            const success = await login(loginCredentials);
            if (success) {
                toast.success("Login realizado com sucesso!");
                navigate("/jobdashboard");
            } else {
                toast.error("Erro ao realizar login. Verifique suas credenciais.");
                console.error("Login failed via context");
            }

        } catch (error: any) {
            const message = error.response?.data?.message || "Erro inesperado durante o login.";
            toast.error(message);
            console.error("Unexpected error during login", error);
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
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Signup() {
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
                    <form>
                        <div className="flex flex-col gap-6">
                             <div className="grid gap-2">
                                <Label htmlFor="email">Nome</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="fulano@email.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                </div>
                                <Input id="password" 
                                type="password" 
                                required />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Confirme sua senha</Label>
                                </div>
                                <Input id="password-confirmation" 
                                type="password" 
                                required />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full cursor-pointer">
                        Criar Conta
                    </Button>
                    <Button type="submit" variant="outline" disabled className="w-full">
                        Crie sua Conta com Google
                    </Button>
                </CardFooter>
            </Card>
        </div>

    )
}

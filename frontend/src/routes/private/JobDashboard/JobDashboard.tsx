import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Menu, LogOut, Briefcase, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function JobDashboard() {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);



    interface FormState {
        title: string;
        company: string;
        description: string;
        startDate: Date | undefined;
        endDate: Date | undefined;
    }

    const [form, setForm] = useState<FormState>({
        title: "",
        company: "",
        description: "",
        startDate: undefined,
        endDate: undefined,
    });


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = () => {
        if (!form.startDate || !form.endDate) return;
        const isClosed = form.endDate < new Date() ? new Date() : null;
        console.log({ ...form, isClosed });
        setModalOpen(false);
    };


    return (
        <div className="flex h-screen w-full bg-background">
            <aside
                className={`${open ? "w-64" : "w-20"} border-r bg-card flex flex-col justify-between transition-all duration-300`}
            >
                <div>
                    <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent" onClick={() => setOpen(!open)}>
                        <Menu className="h-5 w-5" />
                        {open && <span className="font-semibold">Menu</span>}
                    </div>


                    <Separator />


                    <nav className="mt-2 flex flex-col">
                        <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-accent">
                            <Briefcase className="h-5 w-5" />
                            {open && <span className="font-medium">Vagas cadastradas</span>}
                        </div>
                    </nav>
                </div>


                <div className="p-4 border-t flex items-center gap-3 cursor-pointer hover:bg-accent">
                    <LogOut className="h-5 w-5" />
                    {open && <span className="font-medium">Sair</span>}
                </div>
            </aside>


            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Briefcase className="h-6 w-6" /> Vagas cadastradas
                    </h1>
                    <Button onClick={() => setModalOpen(true)}>+ Cadastrar vaga</Button>
                </div>


                <Card>
                    <CardContent className="p-10 text-muted-foreground text-center">
                        Nenhuma vaga cadastrada.
                    </CardContent>
                </Card>
            </main>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Cadastrar vaga</DialogTitle>
                    </DialogHeader>


                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Título*</Label>
                            <Input name="title" value={form.title} onChange={handleChange} required />
                        </div>


                        <div className="grid gap-2">
                            <Label>Empresa</Label>
                            <Input name="company" value={form.company} onChange={handleChange} />
                        </div>


                        <div className="grid gap-2">
                            <Label>Descrição</Label>
                            <Input name="description" value={form.description} onChange={handleChange} />
                        </div>


                        <div className="grid gap-2">
                            <Label>Data inicial*</Label>
                            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !form.startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {form.startDate ? format(form.startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.startDate}
                                        onSelect={(date) => {
                                            setForm({ ...form, startDate: date });
                                            setIsStartDateOpen(false);
                                        }}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>


                        <div className="grid gap-2">
                            <Label>Data final*</Label>
                            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !form.endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {form.endDate ? format(form.endDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={form.endDate}
                                        onSelect={(date) => {
                                            setForm({ ...form, endDate: date });
                                            setIsEndDateOpen(false);
                                        }}
                                        disabled={(date) => !!form.startDate && date < form.startDate}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>


                        <div className="grid gap-2 opacity-50 cursor-not-allowed">
                            <Label>Encerrada automaticamente</Label>
                            <Input disabled placeholder="Calculado pelo sistema" />
                        </div>
                    </div>


                    <DialogFooter>
                        <Button onClick={handleSubmit}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

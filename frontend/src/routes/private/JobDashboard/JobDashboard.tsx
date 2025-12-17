import { useState, useEffect } from "react";
import axios from "axios";
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
import { FieldError } from "@/components/ui/field";

import { useAuth } from "@/context/AuthContext";

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

    const initialFormState: FormState = {
        title: "",
        company: "",
        description: "",
        startDate: undefined,
        endDate: undefined,
    };

    const [form, setForm] = useState<FormState>(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});



    const [jobs, setJobs] = useState<any[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/jobapplication", { withCredentials: true });
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs", error);
            }
        };
        fetchJobs();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof FormState;
        setForm({ ...form, [name]: e.target.value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setModalOpen(isOpen);
        if (!isOpen) {
            setForm(initialFormState);
            setErrors({});
        }
    };


    const handleSubmit = async () => {
        const newErrors: Partial<Record<keyof FormState, string>> = {};
        if (!form.title) newErrors.title = "Título é obrigatório";
        if (!form.startDate) newErrors.startDate = "Data inicial é obrigatória";
        if (form.endDate && form.startDate) {
            if (form.endDate < form.startDate) {
                newErrors.endDate = "Data final deve ser posterior à inicial";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/jobapplication", form, { withCredentials: true });
            if (response.status === 201) {
                setJobs([...jobs, response.data]);
                setForm(initialFormState);
                setErrors({});
                setModalOpen(false);
            }
        } catch (error) {
            console.error("Error creating job", error);
        }
    };

    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
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


                <div className="p-4 border-t flex items-center gap-3 cursor-pointer hover:bg-accent"
                    onClick={handleLogout}>
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


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="p-10 text-muted-foreground text-center">
                                Nenhuma vaga cadastrada.
                            </CardContent>
                        </Card>
                    ) : (
                        jobs.map((job) => (
                            <Card key={job._id}>
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                                    <p className="text-gray-600 mb-4">{job.company}</p>
                                    <p className="text-sm text-gray-500 mb-4">{job.description}</p>
                                    <div className="flex flex-col gap-1 text-sm text-gray-400">
                                        <span>Início: {format(new Date(job.startDate), "dd/MM/yyyy")}</span>
                                        {job.endDate && <span>Fim: {format(new Date(job.endDate), "dd/MM/yyyy")}</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Cadastrar vaga</DialogTitle>
                    </DialogHeader>


                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Título*</Label>
                            <Input name="title" value={form.title} onChange={handleChange} required />
                            {errors.title && <FieldError errors={[{ message: errors.title }]} />}
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
                                            if (date) setErrors({ ...errors, startDate: undefined });
                                            setIsStartDateOpen(false);
                                        }}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.startDate && <FieldError errors={[{ message: errors.startDate }]} />}
                        </div>


                        <div className="grid gap-2">
                            <Label>Data final</Label>
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
                                            if (date) setErrors({ ...errors, endDate: undefined });
                                            setIsEndDateOpen(false);
                                        }}
                                        disabled={(date) => !!form.startDate && date < form.startDate}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.endDate && <FieldError errors={[{ message: errors.endDate }]} />}
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

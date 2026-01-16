import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Menu, LogOut, Briefcase, Trash, Pencil } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { JobModal } from "@/components/modals/JobModal";
import { MultiSelect } from "@/components/ui/multi-select";

export function JobDashboard() {
    interface FormState {
        title: string;
        company: string;
        description: string;
        stacks: string[];
        startDate: Date | undefined;
        endDate: Date | undefined;
        file: File | null;
    }

    const initialFormState: FormState = {
        title: "",
        company: "",
        description: "",
        stacks: [],
        startDate: undefined,
        endDate: undefined,
        file: null,
    };

    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<any>(null);
    const [editingJobId, setEditingJobId] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>(initialFormState);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

    const [techStackOptions, setTechStackOptions] = useState<{ value: string; label: string }[]>([]);

    const [techStackOptionsFilter, setTechStackOptionsFilter] = useState<{ value: string; label: string }[]>([]);
    const [techStackSelectedFilter, setTechStackSelectedFilter] = useState<string[]>([]);

    const [companiesOptionsFilter, setCompaniesOptionsFilter] = useState<string[]>([]);
    const [companiesSelectedFilter, setCompaniesSelectedFilter] = useState<string[]>([]);

    const [jobs, setJobs] = useState<any[]>([]);

    const filteredJob = useMemo(() => {
        if(techStackSelectedFilter.length === 0 && companiesSelectedFilter.length === 0) {
            return jobs;
        }
        
        let result = jobs;

        if(techStackSelectedFilter.length > 0) {
            result = result.filter(job => job.stacks.some(stack => techStackSelectedFilter.includes(stack)))
        }

        if(companiesSelectedFilter.length > 0) {
            result = result.filter(job => job.company.includes(companiesSelectedFilter))
        }

        return result;
    }, [jobs, techStackSelectedFilter, companiesSelectedFilter])

    useEffect(() => {
        const fetchStacks = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/stacks", { withCredentials: true });
                const formattedOptions = response.data.map((stack: any) => ({
                    value: stack.stackValue,
                    label: stack.stackLabel
                }));
                setTechStackOptions(formattedOptions);
                setTechStackOptionsFilter(formattedOptions);
            } catch (error) {
                console.error("Error fetching stacks", error);
            }
        };
        fetchStacks();
    }, []);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name as keyof FormState;
        setForm({ ...form, [name]: e.target.value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const jobCompanies = useMemo(() => {

        const allCompanies = jobs.map(
            job => job.company
        );

        const uniqueCompanies = [...new Set(allCompanies)];

        return uniqueCompanies.map(company => (
            {
                label: company,
                value: company
            }
        ))

    }, [jobs])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 2 * 1024 * 1024) {
                toast.error("O arquivo deve ter no máximo 2MB.");
                e.target.value = "";
                return;
            }
            setForm({ ...form, file: selectedFile });
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setModalOpen(isOpen);
        if (!isOpen) {
            setForm(initialFormState);
            setEditingJobId(null);
            setErrors({});
        }
    };

    const handleSubmit = async () => {
        const newErrors: Partial<Record<keyof FormState, string>> = {};
        if (!form.title) newErrors.title = "Título é obrigatório";
        if (!form.startDate) newErrors.startDate = "Data publicada em é obrigatória";
        if (form.endDate && form.startDate) {
            if (form.endDate < form.startDate) {
                newErrors.endDate = "Data encerrada em deve ser posterior à inicial";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Por favor, corrija os erros no formulário.");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("company", form.company);
        formData.append("description", form.description);
        formData.append("stacks", form.stacks);
        if (form.startDate) formData.append("startDate", form.startDate.toISOString());
        if (form.endDate) formData.append("endDate", form.endDate.toISOString());
        if (form.file) formData.append("file", form.file);

        try {
            let response: any;
            if (editingJobId) {
                response = await axios.put(`http://localhost:3000/api/jobapplication/${editingJobId}`, formData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (response.status === 200) {
                    setJobs(jobs.map(job => job._id === editingJobId ? response.data : job));
                    toast.success("Vaga atualizada com sucesso!");
                }
            } else {
                response = await axios.post("http://localhost:3000/api/jobapplication", formData, {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (response.status === 201) {
                    setJobs([...jobs, response.data]);
                    toast.success("Vaga criada com sucesso!");
                }
            }

            if (response && (response.status === 200 || response.status === 201)) {
                setForm(initialFormState);
                setEditingJobId(null);
                setErrors({});
                setModalOpen(false);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Erro ao salvar vaga.";
            toast.error(message);
            console.error(error.response?.data?.message || error.message);
        }
    };

    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    const handleDeleteClick = (job: any) => {
        setJobToDelete(job);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await axios.delete(`http://localhost:3000/api/jobapplication/${jobToDelete._id}`, { withCredentials: true });
            setJobs(jobs.filter(job => job._id !== jobToDelete._id));
            setDeleteModalOpen(false);
            setJobToDelete(null);
            toast.success("Vaga excluída com sucesso!");
        } catch (error: any) {
            const message = error.response?.data?.message || "Erro ao excluir vaga.";
            toast.error(message);
            console.error("Error deleting job", error);
        }
    };

    const handleEditClick = (job: any) => {
        setEditingJobId(job._id);
        setForm({
            title: job.title,
            company: job.company || "",
            description: job.description || "",
            stacks: job.stacks || [],
            startDate: new Date(job.startDate),
            endDate: job.endDate ? new Date(job.endDate) : undefined,
            file: null,
        });
        setModalOpen(true);
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
                    <Button className="cursor-pointer" onClick={() => setModalOpen(true)}>+ Cadastrar vaga</Button>
                </div>
                <h2>Filtros</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                    <MultiSelect
                        options={techStackOptionsFilter}
                        selected={techStackSelectedFilter}
                        onChange={setTechStackSelectedFilter}
                        placeholder="Selecione as tecnologias..."
                        emptyText="Nenhuma tecnologia encontrada."
                    />
                    <MultiSelect
                        options={jobCompanies}
                        selected={companiesSelectedFilter}
                        onChange={setCompaniesSelectedFilter}
                        placeholder="Selecione as empresas..."
                        emptyText="Nenhuma empresa encontrada, cadastre suas candidaturas."
                    />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.length === 0 ? (
                        <Card className="col-span-full">
                            <CardContent className="p-10 text-muted-foreground text-center">
                                Nenhuma vaga cadastrada.
                            </CardContent>
                        </Card>
                    ) : (techStackSelectedFilter.length === 0 ? (
                        jobs.map((job) => (
                            <Card key={job._id}>
                                <CardContent className="p-6 relative">
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <div className="cursor-pointer text-gray-500 hover:text-blue-500" onClick={() => handleEditClick(job)}>
                                            <Pencil className="h-5 w-5" />
                                        </div>
                                        <div className="cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleDeleteClick(job)}>
                                            <Trash className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold mb-2 pr-8">{job.title}</h2>
                                    <p className="text-gray-600 mb-4">{job.company}</p>
                                    {job.stacks && job.stacks.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {job.stacks.map((stack: string) => (
                                                <Badge key={stack} variant="secondary" className="text-xs">
                                                    {techStackOptions.find(s => s.value === stack)?.label || stack}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500 mb-4">{job.description}</p>
                                    <div className="flex flex-col gap-1 text-sm text-gray-400">
                                        <span>Início: {format(new Date(job.startDate), "dd/MM/yyyy")}</span>
                                        {job.endDate && <span>Fim: {format(new Date(job.endDate), "dd/MM/yyyy")}</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        jobs.filter((j) =>
                            j.stacks.some(stack => techStackSelectedFilter.includes(stack)))
                            .map((job) => (
                                <Card key={job._id}>
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="cursor-pointer text-gray-500 hover:text-blue-500" onClick={() => handleEditClick(job)}>
                                                <Pencil className="h-5 w-5" />
                                            </div>
                                            <div className="cursor-pointer text-gray-500 hover:text-red-500" onClick={() => handleDeleteClick(job)}>
                                                <Trash className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold mb-2 pr-8">{job.title}</h2>
                                        <p className="text-gray-600 mb-4">{job.company}</p>
                                        {job.stacks && job.stacks.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {job.stacks.map((stack: string) => (
                                                    <Badge key={stack} variant="secondary" className="text-xs">
                                                        {techStackOptions.find(s => s.value === stack)?.label || stack}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-500 mb-4">{job.description}</p>
                                        <div className="flex flex-col gap-1 text-sm text-gray-400">
                                            <span>Início: {format(new Date(job.startDate), "dd/MM/yyyy")}</span>
                                            {job.endDate && <span>Fim: {format(new Date(job.endDate), "dd/MM/yyyy")}</span>}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                    ))
                    }
                </div>
            </main>

            <JobModal
                modalOpen={modalOpen}
                handleOpenChange={handleOpenChange}
                editingJobId={editingJobId}
                form={form}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                techStackOptions={techStackOptions}
                errors={errors}
                isStartDateOpen={isStartDateOpen}
                setIsStartDateOpen={setIsStartDateOpen}
                isEndDateOpen={isEndDateOpen}
                setIsEndDateOpen={setIsEndDateOpen}
                setForm={setForm}
                setErrors={setErrors}
                jobs={jobs}
            />

            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Voce deseja apagar a vaga {jobToDelete?.title}?</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="cursor-pointer" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" className="cursor-pointer" onClick={confirmDelete}>Apagar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
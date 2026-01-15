import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, FileText, Download } from "lucide-react";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "sonner";

interface JobModalProps {
    modalOpen: boolean;
    handleOpenChange: (isOpen: boolean) => void;
    editingJobId: string | null;
    form: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => Promise<void>;
    techStackOptions: { value: string; label: string }[];
    errors: any;
    isStartDateOpen: boolean;
    setIsStartDateOpen: (open: boolean) => void;
    isEndDateOpen: boolean;
    setIsEndDateOpen: (open: boolean) => void;
    setForm: (form: any) => void;
    setErrors: (errors: any) => void;
    jobs: any[];
}

export function JobModal({
    modalOpen,
    handleOpenChange,
    editingJobId,
    form,
    handleChange,
    handleFileChange,
    handleSubmit,
    techStackOptions,
    errors,
    isStartDateOpen,
    setIsStartDateOpen,
    isEndDateOpen,
    setIsEndDateOpen,
    setForm,
    setErrors,
    jobs
}: JobModalProps) {

    return (
        <Dialog open={modalOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingJobId ? "Editar vaga" : "Cadastrar vaga"}</DialogTitle>
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
                        <Label>Tecnologias/Stacks</Label>
                        <MultiSelect
                            options={techStackOptions}
                            selected={form.stacks}
                            onChange={(stacks) => setForm({ ...form, stacks })}
                            placeholder="Selecione as tecnologias..."
                            emptyText="Nenhuma tecnologia encontrada."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Descrição</Label>
                        <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Descreva os detalhes da vaga..." maxLength={200} />
                    </div>


                    <div className="grid gap-2">
                        <Label>Vaga publicada em*</Label>
                        <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal cursor-pointer",
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
                        <Label>Vaga encerrada em</Label>
                        <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal cursor-pointer",
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

                    <div className="grid gap-2">
                        <Label>Anexo (PDF)</Label>
                        {editingJobId ? (
                            <div className="flex items-center gap-2">
                                {jobs.find(j => j._id === editingJobId)?.resume ? (
                                    <div className="flex items-center justify-between w-full p-3 border rounded-md bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-full border">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium truncate max-w-[200px]" title={`resume-${jobs.find(j => j._id === editingJobId)?.title}.pdf`}>
                                                    {`resume-${jobs.find(j => j._id === editingJobId)?.title}.pdf`}
                                                </span>
                                                <span className="text-xs text-muted-foreground uppercase">PDF</span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="cursor-pointer hover:bg-background"
                                            onClick={() => {
                                                const job = jobs.find(j => j._id === editingJobId);
                                                if (job?.resume) {
                                                    try {
                                                        const resumeData = job.resume.data || job.resume;
                                                        const byteArray = new Uint8Array(resumeData);
                                                        const blob = new Blob([byteArray], { type: 'application/pdf' });
                                                        const url = window.URL.createObjectURL(blob);
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.setAttribute('download', `resume-${job.title}.pdf`);
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        link.remove();
                                                    } catch (e) {
                                                        console.error("Error downloading PDF", e);
                                                        toast.error("Erro ao baixar o PDF.");
                                                    }
                                                }
                                            }}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500">Nenhum currículo anexado.</span>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Upload de arquivos PDF para descrição da vaga ou outros documentos.</p>
                            </>
                        )}
                    </div>


                    <div className="grid gap-2 opacity-50 cursor-not-allowed">
                        <Label>Encerrada automaticamente</Label>
                        <Input disabled placeholder="Calculado pelo sistema" />
                    </div>
                </div>


                <DialogFooter>
                    <Button className="cursor-pointer" onClick={handleSubmit}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
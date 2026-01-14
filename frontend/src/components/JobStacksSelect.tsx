import { MultiSelect } from "@/components/ui/multi-select";

interface JobStacksSelectProps {
    techStackOptions: any,
    form: any,
    setForm: any
}

export function JobStacksSelect({
    techStackOptions, 
    form, 
    setForm
    }:JobStacksSelectProps
) {

    return (
        <MultiSelect
            options={techStackOptions}
            selected={form.stacks}
            onChange={(stacks) => setForm({ ...form, stacks })}
            placeholder="Selecione as tecnologias..."
            emptyText="Nenhuma tecnologia encontrada."
        />
    )
}
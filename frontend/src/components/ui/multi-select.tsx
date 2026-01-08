"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
    value: string
    label: string
}

interface MultiSelectProps {
    options: MultiSelectOption[]
    selected: string[]
    onChange: (selected: string[]) => void
    placeholder?: string
    emptyText?: string
    className?: string
    disabled?: boolean
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    emptyText = "No items found.",
    className,
    disabled = false,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value))
        } else {
            onChange([...selected, value])
        }
    }

    const handleRemove = (value: string) => {
        onChange(selected.filter((item) => item !== value))
    }

    const selectedOptions = options.filter((option) => selected.includes(option.value))

    return (
        <div className={cn("relative", className)}>
            <div
                className={cn(
                    "flex min-h-10 w-full flex-wrap gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                {selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary" className="gap-1">
                        {option.label}
                        <button
                            type="button"
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRemove(option.value)
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onClick={() => handleRemove(option.value)}
                            disabled={disabled}
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
                <input
                    type="text"
                    placeholder={selected.length === 0 ? placeholder : ""}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onBlur={(e) => {
                        // Don't close if clicking inside the dropdown
                        if (!e.relatedTarget?.closest('[data-multiselect-dropdown]')) {
                            setOpen(false)
                        }
                    }}
                    disabled={disabled}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
                />
            </div>
            {open && (
                <div
                    data-multiselect-dropdown
                    className="absolute top-full z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
                    onMouseDown={(e) => {
                        // Prevent input blur when clicking inside dropdown
                        e.preventDefault()
                    }}
                >
                    <Command>
                        <CommandInput
                            value={inputValue}
                            onValueChange={setInputValue}
                            placeholder="Search..."
                            className="hidden"
                        />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                                {options
                                    .filter((option) =>
                                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                                    )
                                    .map((option) => {
                                        const isSelected = selected.includes(option.value)
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                onSelect={() => handleSelect(option.value)}
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <span>{option.label}</span>
                                            </CommandItem>
                                        )
                                    })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    )
}

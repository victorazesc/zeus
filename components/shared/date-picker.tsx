"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Localização para o idioma português
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Definição das propriedades aceitas pelo componente DatePicker
interface DatePickerProps {
    label?: string; // Texto para exibir quando nenhuma data está selecionada
    value?: Date; // Data atual (controlada externamente)
    onChange?: (date: Date | undefined) => void; // Função para passar a data selecionada para o componente pai
}

export function DatePicker({ label = "Selecione a data", value, onChange }: DatePickerProps) {
    // Estado interno para a data, usando a `value` inicial, se fornecida
    const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);

    // Função para atualizar a data selecionada
    const handleDateChange = (selectedDate: Date | undefined) => {
        setInternalDate(selectedDate); // Atualiza a data no estado local
        if (onChange) {
            onChange(selectedDate); // Chama o callback para atualizar o valor no componente pai
        }
    };

    // Sincroniza a data interna com a `value` externa, caso `value` mude externamente
    React.useEffect(() => {
        setInternalDate(value);
    }, [value]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size={'sm'}
                    variant={"outline"}
                    className={cn(
                        "justify-start text-left font-normal",
                        !internalDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {/* Formatação de data em português com `date-fns` */}
                    {internalDate ? format(internalDate, "PPP", { locale: ptBR }) : <span>{label}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999]">
                {/* Componente de calendário com `locale` em português e modo "single" */}
                <Calendar
                    mode="single"
                    selected={internalDate}
                    onSelect={handleDateChange} // Atualiza a data ao selecionar
                    initialFocus
                    locale={ptBR} // Traduz o calendário para português
                />
            </PopoverContent>
        </Popover>
    );
}
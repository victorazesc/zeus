import * as React from "react";
import { cn } from "@/lib/utils"; // Ou qualquer utilidade CSS que você estiver usando

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "pr-12 flex h-11 w-full rounded-md border border-custom-border-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-custom-text-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };

// Definição do componente MonetaryInput
export interface MonetaryInputProps extends Omit<InputProps, "value" | "onChange" | "type"> {
  value: number; // Valor deve ser um número
  onValueChange: (value: number) => void; // Função que recebe o valor formatado
}

export const MonetaryInput = React.forwardRef<HTMLInputElement, MonetaryInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    // Função para formatar o valor no padrão "R$ 1.234,56"
    const formatToCurrency = (value: number): string => {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      });
    };

    // Função que manipula a entrada do usuário e aplica a formatação
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
      if (rawValue.length === 0) rawValue = "0";

      const floatValue = parseFloat(rawValue) / 100; // Converte para valor decimal
      onValueChange(floatValue); // Atualiza o valor no componente pai
    };

    return (
      <Input
        type="text"
        value={formatToCurrency(value)} // Formata o valor para exibição
        onChange={handleChange} // Manipula a entrada e aplica a máscara
        className={className}
        ref={ref}
        {...props}
      />
    );
  }
);

MonetaryInput.displayName = "MonetaryInput";
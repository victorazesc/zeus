export function normalizeAccents(value: string) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function removeSpecialCharacters(input: string | null | undefined): string | null | undefined {
    if (!input) return input;

    let result = normalizeAccents(input);
    result = result.replace(/[^a-zA-Z0-9 ]/g, '');
    result = result.replace(/\s+/g, '');

    return result;
}


export function isNumber(value: string): boolean {
    return !isNaN(Number(value));
}

export const formatCep = (value: string) => {
    const rawValue = value.replace(/\D/g, ""); // Remove tudo que não for número
    const maskedValue = rawValue.replace(/^(\d{5})(\d)/, "$1-$2"); // Aplica a máscara (xxxxx-xxx)
    return maskedValue;
};

export const formatDocument = (value: string | null) => {
    if (!value) return ""

    const onlyNumbers = value.replace(/\D/g, ""); // Remove tudo que não é número

    if (onlyNumbers.length <= 11) {
        // Formata como CPF: 000.000.000-00
        return onlyNumbers
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
        // Formata como CNPJ: 00.000.000/0000-00
        return onlyNumbers
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

};

export const formatPhone = (value: string | null) => {
    if (!value) return ""
    const rawValue = value.replace(/\D/g, ""); // Remove tudo que não for número
    const maskedValue = rawValue.replace(/^(\d{2})(\d{5})(\d)/, "($1) $2-$3");
    return maskedValue;
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
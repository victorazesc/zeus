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

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL : "";
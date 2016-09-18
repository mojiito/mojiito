export function splitAtColon(input: string, defaultValues: string[]): string[] {
    const colonIndex = input.indexOf(':');
    if (colonIndex == -1) return defaultValues;
    return [input.slice(0, colonIndex).trim(), input.slice(colonIndex + 1).trim()];
}
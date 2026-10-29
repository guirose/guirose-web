const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ruta(destino: string): string {
    return `${BASE}${destino}`;
}
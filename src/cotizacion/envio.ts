const LLAVE = "guirose:envio";
export const VIGENCIA_MS = 10 * 60 * 1000; // vigencia de 10 minutos de los datos de whatsapp

export type Envio = { enlace: string; motor: string; abierto: boolean; guardadoEn: number };

export function guardarEnvio(envio: Omit<Envio, "guardadoEn">) {
  try {
    window.sessionStorage.setItem(LLAVE, JSON.stringify({ ...envio, guardadoEn: Date.now() }));
  } catch {
    // sin sessionStorage
  }
}

export function borrarEnvio() {
  try {
    window.sessionStorage.removeItem(LLAVE);
  } catch {
    // usando sessionStorage no se borra nada
  }
}

export function leerEnvioTexto(): string | null {
  try {
    return window.sessionStorage.getItem(LLAVE);
  } catch {
    return null;
  }
}

export function interpretarEnvio(
  texto: string | null,
  ahora = Date.now(),
): Envio | null {
  if (!texto) return null;
  try {
    const dato: unknown = JSON.parse(texto);
    if (typeof dato !== "object" || dato === null) return null;
    const e = dato as Record<string, unknown>;
    return typeof e.enlace === "string" &&
      e.enlace.startsWith("https://wa.me/") &&
      typeof e.motor === "string" &&
      typeof e.abierto === "boolean" &&
      typeof e.guardadoEn === "number" &&
      ahora - e.guardadoEn < VIGENCIA_MS
      ? {
          enlace: e.enlace,
          motor: e.motor,
          abierto: e.abierto,
          guardadoEn: e.guardadoEn,
        }
      : null;
  } catch {
    return null;
  }
}


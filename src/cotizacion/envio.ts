const LLAVE = "guirose:envio";

export type Envio = { enlace: string; motor: string; abierto: boolean };

export function guardarEnvio(envio: Envio) {
  try {
    window.sessionStorage.setItem(LLAVE, JSON.stringify(envio));
  } catch {
    // sin sessionStorage
  }
}

export function leerEnvioTexto(): string | null {
  try {
    return window.sessionStorage.getItem(LLAVE);
  } catch {
    return null;
  }
}

export function interpretarEnvio(texto: string | null): Envio | null {
  if (!texto) return null;
  try {
    const dato: unknown = JSON.parse(texto);
    if (typeof dato !== "object" || dato === null) return null;
    const e = dato as Record<string, unknown>;
    return typeof e.enlace === "string" &&
      e.enlace.startsWith("https://wa.me/") &&
      typeof e.motor === "string" &&
      typeof e.abierto === "boolean"
      ? { enlace: e.enlace, motor: e.motor, abierto: e.abierto }
      : null;
  } catch {
    return null;
  }
}


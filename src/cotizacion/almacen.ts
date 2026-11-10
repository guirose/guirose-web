import { VERSION, type Seleccion } from "./seleccion";

const LLAVE = "guirose:cotizacion";

const oyentes = new Set<() => void>();
let respaldo: string | null = null;
let textoPrevio: string | null | undefined;
let valorPrevio: Seleccion | null = null;

function esSeleccion(x: unknown): x is Seleccion {
  if (typeof x !== "object" || x === null) return false;
  const s = x as Record<string, unknown>;
  return (
    s.version === VERSION &&
    typeof s.tipo === "string" &&
    typeof s.modelo === "string" &&
    typeof s.medidas === "object" && s.medidas !== null &&
    typeof s.extensiones === "object" && s.extensiones !== null &&
    typeof s.extConsultar === "boolean" &&
    Array.isArray(s.agregados)
  );
}

function leerTexto(): string | null {
  try {
    return window.sessionStorage.getItem(LLAVE);
  } catch {
    return respaldo;
  }
}

export function leerSeleccion(): Seleccion | null {
  const texto = leerTexto();
  if (texto === textoPrevio) return valorPrevio;
  textoPrevio = texto;
  try {
    const dato: unknown = texto ? JSON.parse(texto) : null;
    valorPrevio = esSeleccion(dato) ? dato : null;
  } catch {
    valorPrevio = null;
  }
  return valorPrevio;
}

export function guardarSeleccion(seleccion: Seleccion | null) {
  const texto = seleccion ? JSON.stringify(seleccion) : null;
  respaldo = texto;
  try {
    if (texto) window.sessionStorage.setItem(LLAVE, texto);
    else window.sessionStorage.removeItem(LLAVE);
  } catch {
    // sin sessionStorage queda el respaldo en memoria
  }
  oyentes.forEach((avisar) => avisar());
}

export function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}
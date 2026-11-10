import { masGrande } from "@/contenido/accesorios";
import type { GrupoDeMedidas, ItemEquipamiento } from "@/contenido/equipamiento";
import type { TipoMotor } from "@/contenido/motores";

export const CONSULTAR = "consultar";
export const MAX_CANTIDAD = 5;
export const VERSION = 1;

// lo elegido por el cliente
export type Seleccion = {
  version: number;
  tipo: TipoMotor;
  modelo: string;
  medidas: Record<string, string>;
  extensiones: Record<string, number>;
  extConsultar: boolean;
  agregados: string[];
};

export const claveDe = (item: ItemEquipamiento): string =>
  item.codigo ?? item.descripcion;

export function seleccionInicial(
  tipo: TipoMotor,
  modelo: string,
  grupos: GrupoDeMedidas[],
): Seleccion {
  return {
    version: VERSION,
    tipo,
    modelo,
    medidas: Object.fromEntries(
      grupos
        .filter((g) => g.grupo !== "extension")
        .map((g) => [g.grupo, claveDe(masGrande(g.opciones))]),
    ),
    extensiones: {},
    extConsultar: false,
    agregados: [],
  };
}

export function ajustarSeleccion(
  guardada: Seleccion,
  base: Seleccion,
  grupos: GrupoDeMedidas[],
  opcionales: ItemEquipamiento[],
): Seleccion {
  const clavesDe = (g?: GrupoDeMedidas) => new Set(g?.opciones.map(claveDe));

  const medidas = { ...base.medidas };
  for (const g of grupos) {
    if (g.grupo === "extension") continue;
    const valor = guardada.medidas[g.grupo];
    if (valor === CONSULTAR || (valor !== undefined && clavesDe(g).has(valor))) {
      medidas[g.grupo] = valor;
    }
  }

  const clavesExtension = clavesDe(grupos.find((g) => g.grupo === "extension"));
  const extensiones = Object.fromEntries(
    Object.entries(guardada.extensiones).filter(([clave]) =>
      clavesExtension.has(clave),
    ),
  );

  const clavesOpcionales = new Set(opcionales.map(claveDe));
  const agregados = guardada.agregados.filter((c) => clavesOpcionales.has(c));

  return { ...guardada, medidas, extensiones, agregados };
}
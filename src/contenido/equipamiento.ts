import datos from "./equipamiento.json";
import { esTipoMotor, type TipoMotor } from "./motores";

// Tipos
export const CATEGORIAS = ["incluido", "obligatorio", "medida", "opcional"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const GRUPOS = ["helice", "cable", "llave", "extension"] as const;
export type GrupoMedida = (typeof GRUPOS)[number];

// cantidad que decide el cliente
export type Cantidad = number | "elige";

export type ItemEquipamiento = {
  codigo: string | null;
  descripcion: string;
  categoria: Categoria;
  cantidad: Cantidad;
  grupo?: GrupoMedida;
};

export type EquipamientoModelo = {
  tipo: TipoMotor;
  modelo: string;
  items: ItemEquipamiento[];
};

// el cliente elgie una opcion o varias en las extensiones
export type GrupoDeMedidas = {
  grupo: GrupoMedida;
  titulo: string;
  seleccion: "una" | "varias";
  pregunta?: string;
  opciones: ItemEquipamiento[];
};

export type Equipamiento = {
  tipo: TipoMotor;
  modelo: string;
  ofrece: {
    incluido: ItemEquipamiento[];
    obligatorio: ItemEquipamiento[];
    medidas: GrupoDeMedidas[];
  };
  agregar: ItemEquipamiento[];
};

type ItemCrudo = {
  codigo: string | null;
  descripcion: string;
  categoria: string;
  cantidad: number | string;
  grupo?: string;
};
type ModeloCrudo = { tipo: string; modelo: string; items: ItemCrudo[] };

function esUno<T extends string>(lista: readonly T[], valor: unknown): valor is T {
  return typeof valor === "string" && (lista as readonly string[]).includes(valor);
}

function leerItem(item: ItemCrudo, modelo: string): ItemEquipamiento {
  const error = (detalle: string) =>
    new Error(`equipamiento.json, ${modelo}, "${item.descripcion}": ${detalle}`);

  if (!esUno(CATEGORIAS, item.categoria)) throw error(`categoria "${item.categoria}" desconocida`);

  let cantidad: Cantidad;
  if (item.cantidad === "elige") cantidad = "elige";
  else if (typeof item.cantidad === "number") cantidad = item.cantidad;
  else throw error(`cantidad "${item.cantidad}" no valida`);

  const leido: ItemEquipamiento = {
    codigo: item.codigo,
    descripcion: item.descripcion,
    categoria: item.categoria,
    cantidad,
  };

  if (item.categoria === "medida") {
    if (!esUno(GRUPOS, item.grupo)) throw error(`grupo "${item.grupo}" desconocido`);
    leido.grupo = item.grupo;
  }
  return leido;
}

function leerModelo(m: ModeloCrudo): EquipamientoModelo {
  if (!esTipoMotor(m.tipo)) throw new Error(`equipamiento.json: tipo "${m.tipo}" desconocido`);
  return { tipo: m.tipo, modelo: m.modelo, items: m.items.map((i) => leerItem(i, m.modelo)) };
}

// se valida una sola vez, si pasa algo raro falla aquí
export const equipamientos: EquipamientoModelo[] = (datos as ModeloCrudo[]).map(leerModelo);

// grupo de medidas
const INFO_GRUPO: Record<
  GrupoMedida,
  { titulo: string; seleccion: "una" | "varias"; pregunta?: string }
> = {
  helice: { titulo: "Hélice", seleccion: "una" },
  cable: { titulo: "Cable de aceleración y cambios", seleccion: "una" },
  llave: { titulo: "Interruptor de encendido con llave", seleccion: "una" },
  extension: {
    titulo: "Extensión de arnés",
    seleccion: "varias",
    pregunta: "¿El arnés no te alcanza? Agrega extensiones",
  },
};

// búsqueda
export const equipamientoDe = (tipo: TipoMotor, codigo: string): Equipamiento | undefined => {
  const m = equipamientos.find((e) => e.tipo === tipo && e.modelo === codigo);
  if (!m) return undefined;

  const de = (categoria: Categoria) => m.items.filter((i) => i.categoria ===categoria);

  const medidas: GrupoDeMedidas[] = GRUPOS.map((grupo) => ({
    grupo,
    ...INFO_GRUPO[grupo],
    opciones: m.items.filter((i) => i.categoria === "medida" && i.grupo === grupo),
  })).filter((g) => g.opciones.length > 0);

  return {
    tipo: m.tipo,
    modelo: m.modelo,
    ofrece: { incluido: de("incluido"), obligatorio: de("obligatorio"), medidas },
    agregar: de("opcional"),
  };
};

export const tieneEquipamiento = (tipo: TipoMotor, codigo: string): boolean =>
  equipamientos.some((e) => e.tipo === tipo && e.modelo === codigo);
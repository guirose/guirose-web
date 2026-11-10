import type { ItemEquipamiento } from "./equipamiento";

const EXTENSION_FOTOS = "png";

type Regla = {
  patron: RegExp;
  nombre: string;
  foto?: string;
};

const REGLAS: Regla[] = [
  // Medidas que el cliente elige
  {
    patron: /^HELICE \(/,
    nombre: "Hélice de aluminio",
    foto: "helice-aluminio",
  },
  {
    patron: /^CABLE DE ACELERACION.*MERCURY/,
    nombre: "Cable de aceleración y cambios Mercury",
    foto: "cable-aceleracion-mercury",
  },
  {
    patron: /^CABLE DE ACELERACION.*UFLEX/,
    nombre: "Cable de aceleración y cambios Uflex",
    foto: "cable-aceleracion-uflex",
  },
  {
    patron: /^INTERRUPTORES? DE ENCENDIDO DE MOTOR CON LLAVE/,
    nombre: "Interruptor de encendido con llave",
    foto: "interruptor-llave",
  },
  {
    patron: /^EXTENSI[OÓ]N DE ARNES/,
    nombre: "Extensión de arnés",
    foto: "extension-arnes",
  },

  // Incluido
  { patron: /^MANUAL DE USUARIO/, nombre: "Manual de usuario y guía rápida" },
  {
    patron: /TAC[OÓ]METRO.*SC1000/,
    nombre: "Tacómetro SmartCraft SC1000",
    foto: "tacometro-sc1000",
  },
  {
    patron: /^BARRA DE UNI[OÓ]N/,
    nombre: "Barra de unión de dirección mecánica",
    foto: "barra-union",
  },
  {
    patron: /^SET DE CABLES DE ALIMENTACI[OÓ]N/,
    nombre: "Cables de batería (+ y −)",
    foto: "cables-bateria",
  },
  {
    patron: /^FILTRO SEPARADOR DE AGUA CON SENSOR/,
    nombre: "Filtro separador de agua con sensor",
    foto: "filtro-separador-sensor",
  },
  {
    patron: /^FILTRO DE COMBUSTIBLE SEPARADOR/,
    nombre: "Filtro separador de agua",
    foto: "filtro-separador",
  },
  {
    patron: /^SET DE PERNOS DE ANCLAJE/,
    nombre: "Pernos de anclaje",
    foto: "pernos-anclaje",
  },
  {
    patron: /^KIT DE MANGUERA DE COMBUSTIBLE/,
    nombre: "Kit de manguera de combustible",
    foto: "manguera-kit",
  },
  {
    patron: /^TANQUE DE COMBUSTIBLE/,
    nombre: "Tanque de combustible",
    foto: "tanque-combustible",
  },
  { patron: /^HELICE/, nombre: "Hélice", foto: "helice-aluminio" },
  {
    patron: /^TAC[OÓ]METRO \/ HOR[OÓ]METRO/,
    nombre: "Tiny Tacho (tacómetro y horómetro)",
    foto: "tiny-tacho",
  },

  // Obligatorios de opción única
  {
    patron: /^CONTROL REMOTO TIPO CONSOLA/,
    nombre: "Control remoto tipo consola Gen II",
    foto: "control-remoto",
  },
  {
    patron: /^BASE P\/INTERRUPTOR/,
    nombre: "Base del interruptor de encendido",
    foto: "base-interruptor",
  },
  {
    patron: /^INTERRUPTOR DE PARADA/,
    nombre: "Interruptor de parada de emergencia",
    foto: "interruptor-parada",
  },
  {
    patron: /^CAJA DE EMPALMES/,
    nombre: "Caja de empalmes de 5 entradas",
    foto: "caja-empalmes",
  },
  {
    patron: /^INTERRUPTOR DE BATERIA/,
    nombre: "Interruptor de batería",
    foto: "interruptor-bateria",
  },
  { patron: /^SET DE BORNES/, nombre: "Bornes de batería", foto: "bornes" },
  {
    patron: /^PROTECTOR DE TERMINAL/,
    nombre: "Protector de terminal de batería",
    foto: "protector-terminal",
  },
  {
    patron: /^SENSOR DE PRESI[OÓ]N/,
    nombre: "Sensor de presión de agua",
    foto: "sensor-presion",
  },
  {
    patron: /^MANGUERA DE COMBUSTIBLE 3\/8/,
    nombre: "Manguera de combustible 3/8″ (12 ft)",
    foto: "manguera-combustible",
  },
  { patron: /^ABRAZADERA/, nombre: "Abrazaderas", foto: "abrazaderas" },
  {
    patron: /^SET DE MANGUERA CORRUGADA/,
    nombre: "Set de manguera corrugada",
    foto: "manguera-corrugada",
  },
  {
    patron: /^BISEL NEGRO/,
    nombre: "Bisel negro del tacómetro",
    foto: "bisel-negro",
  },
  {
    patron: /^MAZO CLEAN POWER/,
    nombre: "Mazo Clean Power con DTS",
    foto: "mazo-clean-power",
  },
  {
    patron: /^FLO-TORQ/,
    nombre: "Flo-Torq SSR-HD (cubo de hélice)",
    foto: "flo-torq",
  },

  // Opcionales
  { patron: /^BATERIA/, nombre: "Batería Bosch", foto: "bateria-bosch" },
];

export type DatosAccesorio = {
  nombre: string;
  foto?: string;
  conocido: boolean;
};

const aTitulo = (texto: string) =>
  texto.charAt(0) + texto.slice(1).toLowerCase();

export function describirItem(item: ItemEquipamiento): DatosAccesorio {
  const regla = REGLAS.find((r) => r.patron.test(item.descripcion));
  if (!regla) {
    // Ítem nuevo sin regla, se mostrará su descripción tal cual sin foto
    return { nombre: aTitulo(item.descripcion), conocido: false };
  }
  return {
    nombre: regla.nombre,
    foto: regla.foto
      ? `/imagenes/accesorios/${regla.foto}.${EXTENSION_FOTOS}`
      : undefined,
    conocido: true,
  };
}

// Opciones de medida
export function etiquetaOpcion(item: ItemEquipamiento): string {
  const d = item.descripcion;
  const paso = d.match(/\((\d+)X(\d+)X(\d+)\)/);
  if (paso) return `${paso[1]} x ${paso[2]} x ${paso[3]}`;
  const largo = d.match(/(\d+)\s?FT/);
  if (largo) return `${largo[1]} ft`;
  return aTitulo(d);
}

// Marca del cable Mercury y Uflex
export function marcaCable(item: ItemEquipamiento): string | undefined {
  if (/MERCURY/.test(item.descripcion)) return "Mercury";
  if (/UFLEX/.test(item.descripcion)) return "Uflex";
  return undefined;
}

// Detalle de la bateria
export function detalleBateria(item: ItemEquipamiento): string | undefined {
  const m = item.descripcion.match(/\[(\d+)A\/(\d+) PLACAS\/(\d+) CCA\]/);
  return m ? `${m[1]} A - ${m[2]} placas - ${m[3]} CCA` : undefined;
}

export function tamanoOpcion(item: ItemEquipamiento): number {
  const d = item.descripcion;
  const paso = d.match(/\((\d+)X(\d+)X(\d+)\)/);
  if (paso) return Number(paso[2]) * 100 + Number(paso[3]);
  const largo = d.match(/(\d+)\s?FT/);
  return largo ? Number(largo[1]) : 0;
}

export function masGrande(opciones: ItemEquipamiento[]): ItemEquipamiento {
  return opciones.reduce((mayor, o) =>
    tamanoOpcion(o) >= tamanoOpcion(mayor) ? o : mayor,
  );
}

const SIGLAS = new Set([
  "SC10000",
  "GEN",
  "II",
  "DTS",
  "SSR-HD",
  "FLO-TORQ",
  "CCA",
  "ON",
  "OFF",
  "L",
  "A",
]);
const MARCAS: Record<string, string> = {
  MERCURY: "Mercury",
  UFLEX: "Uflex",
  BOSCH: "Bosch",
  QUICKSILVER: "Quicksilver",
  SMARTCRAFT: "Smartcraft",
};

const TILDES: Record<string, string> = {
  ACELERACION: "aceleración",
  TACOMETRO: "tacómetro",
  HOROMETRO: "horómetro",
  BATERIA: "batería",
  HELICE: "hélice",
  ELECTRICO: "eléctrico",
  ARNES: "arnés",
};

export function descripcionDetallada(item: ItemEquipamiento): string {
  const texto = item.descripcion
    .replace(
      /(?<![0-9A-Za-zÁÉÍÓÚÑ])[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ0-9]*(?:-[A-ZÁÉÍÓÚÑ0-9]+)*(?![a-záéíóúñ])/g,
      (p) => (SIGLAS.has(p) ? p : (MARCAS[p] ?? TILDES[p] ?? p.toLowerCase())),
    )
    .replace(/(\d)X(?=\d)/g, "$1×")
    .replace(/(\d)\s?(FT|MM|GAL|M)\b/g, (_, n, u) => `${n} ${u.toLowerCase()}`)
    .replace(/\bp\//g, "para ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Largo en metro de una medida
export function metrosOpcion(item: ItemEquipamiento): string | undefined {
  const m = item.descripcion.match(/\/\s?([\d.]+)\s?M\)/);
  return m ? `${m[1].replace(".", ",")} m` : undefined;
}
export type TipoMotor = "2-tiempos" | "4-tiempos";

export type Linea = "SeaPro";

export type Control = "Mando popero" | "Control remoto";
export type Inclinacion = "Manual" | "Eléctrica" | "Gas Asistido";
export type Altura = 15 | 20 | 25; // pulgadas
export type Arranque = "Manual" | "Eléctrico";

// modelo
export type Variante = {
  codigo: string;
  altura: Altura;
  peso: number; // kg
  control: Control;
  inclinacion: Inclinacion;
};

// Datos que comparten los modelos de una misma potencia
export type DatosMotor = {
  tipoMotor: string;
  cilindros: string;
  valvulas?: string; // 2 tiempo no tiene
  cilindrada: string;
  arranque: Arranque;
  rango: string;
  relacion:string;
  aceite?: string; // 2 tiempos no tiene
};

export type FilaFicha = {
  etiqueta: string;
  valor: string;
};

export type Motor = {
  tipo: TipoMotor;
  hp: number;
  linea: Linea;
  datos: DatosMotor;
  variantes: Variante[];
};

// Convierte lista de códigos en la lista de variantes
const v = (
  codigo: string,
  altura: Altura,
  peso: number,
  control: Control,
  inclinacion: Inclinacion,
): Variante => ({ codigo, altura, peso, control, inclinacion });

export const motores: Motor[] = [
  // 2 tiempos
  {
    tipo: "2-tiempos",
    hp: 15,
    linea: "SeaPro",
    datos: {
      tipoMotor: "2T / carburado",
      cilindros: "2 en línea",
      cilindrada: "262 cc",
      arranque: "Manual",
      rango: "5,000 - 6,000 rpm",
      relacion: "2.00:1",
    },
    variantes: [
      v("15MH", 15, 35, "Mando popero", "Manual"),
      v("15MLH", 20, 35, "Mando popero", "Manual"),
      v("15MXLH", 25, 38, "Mando popero", "Manual"),
    ],
  },
  {
    tipo: "2-tiempos",
    hp: 25,
    linea: "SeaPro",
    datos: {
      tipoMotor: "2T / carburado",
      cilindros: "2 en línea",
      cilindrada: "430 cc",
      arranque: "Manual",
      rango: "5,000 - 5,850 rpm",
      relacion: "1.92:1",
    },
    variantes: [
      v("25MH", 15, 48, "Mando popero", "Manual"),
      v("25MLH", 20, 48, "Mando popero", "Manual"),
    ],
  },
  {
    tipo: "2-tiempos",
    hp: 40,
    linea: "SeaPro",
    datos: {
      tipoMotor: "2T / carburado",
      cilindros: "3 en línea",
      cilindrada: "697 cc",
      arranque: "Manual",
      rango: "5,000 - 5,700 rpm",
      relacion: "1.85:1",
    },
    variantes: [
      v("40MH", 15, 75, "Mando popero", "Manual"),
      v("40MLH", 20, 75, "Mando popero", "Manual"),
      v("40MXLH", 25, 75, "Mando popero", "Manual"),
    ],
  },

  // 4 tiempos
  {
    tipo: "4-tiempos",
    hp: 15,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / carburado",
      cilindros: "2 en línea",
      cilindrada: "333 cc",
      arranque: "Manual",
      rango: "4,500 - 5,500 rpm",
      relacion: "2.15:1",
      aceite: "1,0 L",
    },
    variantes: [
      v("15MH", 15, 46.7, "Mando popero", "Manual"),
      v("15MLH", 20, 48.5, "Mando popero", "Manual"),
    ],
  },
  {
    tipo: "4-tiempos",
    hp: 25,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / inyección / SOHC",
      cilindros: "3 en línea",
      valvulas: "6",
      cilindrada: "500 cc",
      arranque: "Manual",
      rango: "5,400 - 5,800 rpm",
      relacion: "2.17:1",
      aceite: "1,4 L",
    },
    variantes: [
      v("25MH", 15, 59.9, "Mando popero", "Manual"),
      v("25MLH", 20, 60.3, "Mando popero", "Manual"),
      v("25MXLH", 25, 60.3, "Mando popero", "Manual"),
    ],
  },
  {
    tipo: "4-tiempos",
    hp: 60,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / inyección / SOHC",
      cilindros: "4 en línea",
      valvulas: "8",
      cilindrada: "995 cc",
      arranque: "Eléctrico",
      rango: "4,500 - 5,500 rpm",
      relacion: "2.33:1",
      aceite: "3.0 L",
    },
    variantes: [
      v("60ELPT", 20, 118, "Control remoto", "Eléctrica"),
      v("60EXLPT", 25, 118, "Control remoto", "Eléctrica"),
      v("60EXLHPT", 25, 118, "Mando popero", "Eléctrica"),
      v("60ELHGA", 20, 118, "Mando popero", "Gas Asistido"),
    ],
  },
  {
    tipo: "4-tiempos",
    hp: 75,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / inyección / SOHC",
      cilindros: "4 en línea",
      valvulas: "8",
      cilindrada: "2,100 cc",
      arranque: "Eléctrico",
      rango: "5,000 - 5,500 rpm",
      relacion: "2.38:1",
      aceite: "5,2 L",
    },
    variantes: [
      v("75ELPT", 20, 163, "Control remoto", "Eléctrica"),
      v("75ELHPT", 20, 163, "Mando popero", "Eléctrica"),
    ],
  },
  {
    tipo: "4-tiempos",
    hp: 115,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / inyección / SOHC",
      cilindros: "4 en línea",
      valvulas: "8",
      cilindrada: "2,100 cc",
      arranque: "Eléctrico",
      rango: "5,000 - 5,500 rpm",
      relacion: "2.38:1",
      aceite: "5,2 L",
    },
    variantes: [
      v("115ELPT", 20, 165, "Control remoto", "Eléctrica"),
      v("115EXLPT", 25, 165, "Control remoto", "Eléctrica"),
      v("115ELHPT", 20, 172, "Mando popero", "Eléctrica"),
      v("115EXLHPT", 25, 172, "Mando popero", "Eléctrica"),
    ],
  },
  {
    tipo: "4-tiempos",
    hp: 150,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / inyección / SOHC",
      cilindros: "4 en línea",
      valvulas: "8",
      cilindrada: "3,000 cc",
      arranque: "Eléctrico",
      rango: "4,800 - 5,300 rpm",
      relacion: "2.08:1",
      aceite: "6,0 L",
    },
    variantes: [
      v("150ELPT", 20, 213, "Control remoto", "Eléctrica"),
      v("150EXLPT", 25, 213, "Control remoto", "Eléctrica"),
      v("150EXLHPT", 25, 213, "Mando popero", "Eléctrica"),
    ],
  },
  {
    tipo: "4-tiempos",
    hp: 200,
    linea: "SeaPro",
    datos: {
      tipoMotor: "4T / inyección / SOHC",
      cilindros: "6 en V",
      valvulas: "24",
      cilindrada: "3,400 cc",
      arranque: "Eléctrico",
      rango: "4,600 - 5,400 rpm",
      relacion: "1.85:1",
      aceite: "6,6 L",
    },
    variantes: [
      v("200EXLPT", 25, 225, "Control remoto", "Eléctrica"),
    ],
  },
];

// Búsquedas

export const slugDe = (motor: Motor): string => `${motor.hp}-hp`;

export const rutaDe = (motor: Motor): string => `/motores/${motor.tipo}/${slugDe(motor)}`;

export const motoresDe = (tipo: TipoMotor): Motor[] => motores.filter((m) => m.tipo === tipo);

export const buscarMotor = (tipo: TipoMotor, slug: string): Motor | undefined => motores.find((m) => m.tipo === tipo && slugDe(m) === slug);

export const TIPOS_MOTOR: TipoMotor[] = ["2-tiempos", "4-tiempos"];

export const esTipoMotor = (valor: string): valor is TipoMotor => TIPOS_MOTOR.some((tipo) => tipo === valor);

export const infoTipo: Record<
  TipoMotor, 
  { nombre: string; titulo: string; subtitulo: string }
> = {
  "2-tiempos": {
    nombre: "2 tiempos",
    titulo: "Motores 2 tiempos",
    subtitulo: "Mayor eficiencia, mayor control",
  },
  "4-tiempos": {
    nombre: "4 tiempos",
    titulo: "Motores 4 tiempos",
    subtitulo: "Más potencia, menos consumo",
  },
};

// Identificadores
export const idDe = (motor: Motor): string => `${motor.tipo}-${slugDe(motor)}`;

// Carpeta de fotos de cada tipo
const carpetaFotos: Record<TipoMotor, string> = {
  "2-tiempos": "2T",
  "4-tiempos": "4T",
};

// Foto de cada motor
export const fotoDe = (motor: Motor): string => `/imagenes/${carpetaFotos[motor.tipo]}/${slugDe(motor)}.png`;

// Características base
export const fichaDe = (motor: Motor): FilaFicha[] => {
  const d = motor.datos;
  return [
    { etiqueta: "Potencia", valor: `${motor.hp} HP` },
    { etiqueta: "Tipo de motor", valor: d.tipoMotor },
    { etiqueta: "Cilindros", valor: d.cilindros },
    ...(d.valvulas ? [{ etiqueta: "Válvulas", valor: d.valvulas }] : []),
    { etiqueta: "Cilindrada", valor: d.cilindrada },
    { etiqueta: "Sistema de arranque", valor: d.arranque },
    { etiqueta: "Color", valor: "Negro" },
    { etiqueta: "Rango de operación", valor: d.rango },
    { etiqueta: "Relación de transmisión", valor: d.relacion },
    ...(d.aceite ? [{ etiqueta: "Aceite del motor", valor: d.aceite }] : []),
  ];
};

// formato kg
const kg = (n: number): string => String(n).replace(".", ",");

// rango kg
export const rangoPeso = (motor: Motor): string => {
  const pesos = motor.variantes.map((x) => x.peso);
  const min = Math.min(...pesos);
  const max = Math.max(...pesos);
  return min === max ? `${kg(min)} kg` : `${kg(min)} - ${kg(max)} kg`;
};

// peso del modelo
export const pesoDe = (variante: Variante): string => `${kg(variante.peso)} kg`;

export const vecinosDe = (
  motor: Motor,
): { anterior?: Motor; siguiente?: Motor } => {
  const lista = motoresDe(motor.tipo).sort((a, b) => a.hp - b.hp);
  const i = lista.findIndex((m) => m.hp === motor.hp);
  return { anterior: lista[i - 1], siguiente: lista[i + 1] };
};
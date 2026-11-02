export type TipoMotor = "2-tiempos" | "4-tiempos";

export type Linea = "SeaPro";

export type Variante = {
  codigo: string; // codigo de variantes de motores
};

export type FilaFicha = {
  etiqueta: string;
  valor: string;
};

export type Motor = {
  tipo: TipoMotor;
  hp: number;
  linea: Linea;
  variantes: Variante[];
  ficha: FilaFicha[]; // datos tecnicos vacios hasta tenerlos
};

// Convierte lista de códigos en la lista de variantes
const v = (...codigos: string[]): Variante[] =>
  codigos.map((codigo) => ({ codigo }));

export const motores: Motor[] = [
  // 2 tiempos
  {
    tipo: "2-tiempos",
    hp: 15,
    linea: "SeaPro",
    variantes: v("15MH", "15MLH"),
    ficha: [],
  },
  {
    tipo: "2-tiempos",
    hp: 25,
    linea: "SeaPro",
    variantes: v("25MH", "25MLH"),
    ficha: [],
  },
  {
    tipo: "2-tiempos",
    hp: 40,
    linea: "SeaPro",
    variantes: v("40MH", "40MLH", "40MXLH"),
    ficha: [],
  },

  // 4 tiempos
  {
    tipo: "4-tiempos",
    hp: 15,
    linea: "SeaPro",
    variantes: v("15MH", "15MLH"),
    ficha: [],
  },
  {
    tipo: "4-tiempos",
    hp: 25,
    linea: "SeaPro",
    variantes: v("25MH", "25MLH"),
    ficha: [],
  },
  {
    tipo: "4-tiempos",
    hp: 60,
    linea: "SeaPro",
    variantes: v("60ELPT", "60EXLPT", "60EXLHPT", "60ELHGA"),
    ficha: [],
  },
  {
    tipo: "4-tiempos",
    hp: 75,
    linea: "SeaPro",
    variantes: v("75ELPT", "75ELHPT"),
    ficha: [],
  },
  {
    tipo: "4-tiempos",
    hp: 115,
    linea: "SeaPro",
    variantes: v("115ELPT", "115EXLPT", "115ELHPT", "115EXLHPT"),
    ficha: [],
  },
  {
    tipo: "4-tiempos",
    hp: 150,
    linea: "SeaPro",
    variantes: v("150ELPT", "150EXLPT"),
    ficha: [],
  },
  {
    tipo: "4-tiempos",
    hp: 200,
    linea: "SeaPro",
    variantes: v("200EXLPT"),
    ficha: [],
  },
];

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
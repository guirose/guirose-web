// Tipos de motor
export type TipoMotor = "2 tiempos" | "4 tiempos";
export type UsoMotor = "comercial" | "gubernamental" | "recreacional";

export type PeriodoGarantia = {
  uso: UsoMotor;
  anios: number;
  horasMaximas: number | null; // null = sin límite de horas
};

export type GarantiaPorTipo = {
  tipo: TipoMotor;
  periodos: PeriodoGarantia[];
};

// Datos de cada motor
export const garantias: GarantiaPorTipo[] = [
  {
    tipo: "2 tiempos",
    periodos: [
      { uso: "comercial", anios: 1, horasMaximas: 500 },
      { uso: "gubernamental", anios: 1, horasMaximas: null },
      { uso: "recreacional", anios: 1, horasMaximas: null },
    ],
  },
  {
    tipo: "4 tiempos",
    periodos: [
      { uso: "comercial", anios: 2, horasMaximas: 1000 },
      { uso: "gubernamental", anios: 3, horasMaximas: null },
      { uso: "recreacional", anios: 3, horasMaximas: null },
    ],
  },
];

// Función que convierte un periodo en texto para mostrar
export function describirPeriodo({
  anios,
  horasMaximas,
}: PeriodoGarantia): string {
  const tiempo = `${anios} ${anios === 1 ? "año" : "años"}`;
  if (horasMaximas === null) return `${tiempo} sin límite de horas`;
  return `${tiempo} ó ${horasMaximas.toLocaleString("en-US")} horas`;
}

export function describirHoras({ horasMaximas }: PeriodoGarantia): string {
    if(horasMaximas === null) return "sin límite de horas";
    return `ó hasta ${horasMaximas?.toLocaleString("en-US")} horas`;
}

// Datos de la empresa
export const CORREO_SOPORTE = "guirose@gmail.com";
export const NOMBRE_TIENDA = "GUIROSE"
import type { CSSProperties, ReactNode } from "react";

type Fila = { etiqueta: string; valor: string };

type PropsFichaTecnica = {
  hp: number;
  base: Fila[]; // Caracteristicas base
  configuracion?: Fila[]; // Segun el modelo del motor
};

const ETIQUETAS_CONFIG = [
  "Modelo",
  "Control de aceleración",
  "Altura de transmisión",
  "Inclinación",
  "Peso",
];

function FilaDato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-guirose-espuma-fuerte py-2.5 last:border-b-0">
      <dt className="text-sm text-guirose-texto">{etiqueta}</dt>
      <dd className="text-right text-sm font-semibold text-guirose-marino">{children}</dd>
    </div>
  );
}

export default function FichaTecnica({ hp, base, configuracion }: PropsFichaTecnica) {
  // Las filas se reparten en dos columnas
  const filasPorColumna = Math.ceil(base.length / 2);

  return (
    <section aria-labelledby="titulo-ficha" className="py-10 lg:py-14">
      <h2
        id="titulo-ficha"
        className="relative mb-6 border-b-2 border-guirose-espuma-fuerte pb-4 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:mb-8 lg:text-[32px]"
      >
        Ficha técnica
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-0.5 w-[72px] bg-guirose-azul lg:w-24"
        />
      </h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-lg bg-guirose-espuma p-5">
          <h3 className="text-lg font-bold text-guirose-marino">
            Según tu modelo
          </h3>
          <p className="mt-1 text-sm text-guirose-texto">
            Revisa un modelo arriba para ver su configuración
          </p>
          <dl className="mt-3">
            {ETIQUETAS_CONFIG.map((etiqueta) => {
              const valor = configuracion?.find(
                (f) => f.etiqueta === etiqueta,
              )?.valor;
              return (
                <FilaDato key={etiqueta} etiqueta={etiqueta}>
                  {valor ?? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-guirose-accion">
                      Al cotizar
                    </span>
                  )}
                </FilaDato>
              );
            })}
          </dl>
        </div>

        <div className="rounded-lg border border-guirose-borde p-5">
          <h3 className="text-lg font-bold text-guirose-marino">
            Características base
          </h3>
          <p className="mt-1 text-sm text-guirose-texto">
            Iguales en todos los modelos de {hp} HP
          </p>
          <dl
            className="mt-3 lg:grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--filas),auto)] lg:gap-x-10"
            style={{ "--filas": filasPorColumna } as CSSProperties}
          >
            {base.map((fila) => (
              <FilaDato key={fila.etiqueta} etiqueta={fila.etiqueta}>
                {fila.valor}
              </FilaDato>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
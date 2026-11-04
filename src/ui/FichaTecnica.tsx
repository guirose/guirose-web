"use client"

import { useState, type CSSProperties, type ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

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

const estiloTitulo =
  "text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[32px]";

function FilaDato({ etiqueta, children }: { etiqueta: string; children: ReactNode; }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-guirose-espuma-fuerte py-2.5 last:border-b-0">
      <dt className="text-sm text-guirose-texto">{etiqueta}</dt>
      <dd className="text-right text-sm font-semibold text-guirose-marino">{children}</dd>
    </div>
  );
}

export default function FichaTecnica({ hp, base, configuracion, }: PropsFichaTecnica) {
  const [abierto, setAbierto] = useState(true);
  
  // Las filas se reparten en dos columnas
  const filasPorColumna = Math.ceil(base.length / 2);

  return (
    <section aria-labelledby="titulo-ficha" className="py-10 lg:py-14">
      {/* Celular */}
      <h2 className="lg:hidden">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls="contenido-ficha"
          onClick={() => setAbierto((actual) => !actual)}
          className={`flex min-h-14 w-full touch-manipulation items-center justify-between border-b-2 border-guirose-espuma-fuerte text-left ${estiloTitulo}`}
        >
          Ficha técnica
          <CaretDownIcon
            aria-hidden="true"
            className={`h-6 w-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${abierto ? "rotate-180" : ""}`}
          />
        </button>
      </h2>

      {/* Escritorio */}
      <h2
        className={`relative mb-8 hidden border-b-2 border-guirose-espuma-fuerte pb-4 lg:block ${estiloTitulo}`}
      >
        Ficha técnica
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-0.5 w-24 bg-guirose-azul"
        />
      </h2>

      <div
        id="contenido-ficha"
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none lg:grid-rows-[1fr] ${abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr] max-lg:invisible"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-6 pt-4 lg:grid-cols-[1fr_2fr] lg:pt-0">
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
        </div>
      </div>
    </section>
  );
}
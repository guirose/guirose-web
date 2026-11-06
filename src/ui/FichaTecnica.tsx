"use client";

import { useState, type ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

type Fila = { etiqueta: string; valor: string };

type PropsFichaTecnica = {
  hp: number;
  base: Fila[]; // Características base
  configuracion?: Fila[]; // Según el modelo del motor
};

const ETIQUETAS_CONFIG = [
  "Modelo",
  "Control de aceleración",
  "Altura de transmisión",
  "Inclinación",
  "Peso",
];

const estiloTitulo =
  "text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[26px]";

function FilaDato({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-guirose-espuma-fuerte py-2.5 last:border-b-0">
      <dt className="text-sm text-guirose-texto lg:text-[15px]">{etiqueta}</dt>
      <dd className="text-right text-sm font-semibold text-guirose-marino lg:text-[15px]">
        {children}
      </dd>
    </div>
  );
}

export default function FichaTecnica({
  hp,
  base,
  configuracion,
}: PropsFichaTecnica) {
  const [abierto, setAbierto] = useState(true);

  return (
    <section className="mt-10 border-t border-guirose-espuma-fuerte pt-8">
      {/* Celular: se abre y se cierra */}
      <h2 className="lg:hidden">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls="contenido-ficha"
          onClick={() => setAbierto((actual) => !actual)}
          className={`flex min-h-14 w-full touch-manipulation items-center justify-between text-left ${estiloTitulo}`}
        >
          Ficha técnica
          <CaretDownIcon
            aria-hidden="true"
            className={`h-6 w-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${abierto ? "rotate-180" : ""}`}
          />
        </button>
      </h2>

      {/* Escritorio */}
      <h2 className={`mb-5 hidden lg:block ${estiloTitulo}`}>Ficha técnica</h2>

      <div
        id="contenido-ficha"
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none lg:grid-rows-[1fr] ${abierto ? "grid-rows-[1fr]" : "grid-rows-[0fr] max-lg:invisible"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid gap-5 pt-4 lg:pt-0">
            <div className="rounded-xl bg-guirose-espuma p-5">
              <h3 className="text-lg font-bold text-guirose-marino">
                Según tu modelo
              </h3>
              <p className="mt-1 text-sm text-guirose-texto">
                Cambia con lo que elijas en el configurador
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

            <div className="rounded-xl border border-guirose-borde p-5">
              <h3 className="text-lg font-bold text-guirose-marino">
                Características base
              </h3>
              <p className="mt-1 text-sm text-guirose-texto">
                Iguales en todos los modelos de {hp} HP
              </p>
              <dl className="mt-3">
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

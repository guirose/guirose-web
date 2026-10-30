"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BankIcon, BoatIcon, SailboatIcon } from "@phosphor-icons/react/ssr";
import type { UsoMotor } from "@/contenido/garantia";

export type UsoGarantia = {
  uso: UsoMotor;
  anios: number;
  leyenda: string;
};

export type PanelGarantia = {
  titulo: string;
  etiqueta: string;
  color: "rojo" | "marino";
  imagen: ReactNode;
  usos: UsoGarantia[];
};

const detalleUso = {
  comercial: { nombre: "Uso comercial", Icono: SailboatIcon },
  gubernamental: { nombre: "Uso gubernamental", Icono: BankIcon },
  recreacional: { nombre: "Uso recreacional", Icono: BoatIcon },
};

const colores = {
  rojo: "bg-guirose-rojo",
  marino: "bg-guirose-marino",
};

// Dónde está cada panel respecto al activo
function posicion(indice: number, activo: number) {
  if (indice === activo) return "activo";
  return indice < activo ? "izquierda" : "derecha";
}

export default function SelectorGarantia({
  paneles,
}: {
  paneles: PanelGarantia[];
}) {
  const [activo, setActivo] = useState(0);

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Tipo de motor"
        className="relative mx-auto grid w-full max-w-[520px] auto-cols-fr grid-flow-col rounded-2xl bg-guirose-espuma p-1.5"
      >
        <span
          aria-hidden="true"
          className={`absolute left-1.5 top-1.5 h-[60px] rounded-xl transition-[translate,background-color] duration-[450ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${colores[paneles[activo].color]}`}
          style={{
            width: `calc((100% - 12px) / ${paneles.length})`,
            translate: `${activo * 100}% 0`,
          }}
        />
        {paneles.map((panel, indice) => (
          <label
            key={panel.titulo}
            className={`relative z-10 flex h-[60px] cursor-pointer items-center justify-center rounded-xl text-lg font-semibold transition-colors duration-200 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-guirose-marino sm:text-xl ${
              indice === activo
                ? "text-white"
                : "text-guirose-texto hover:text-guirose-marino"
            }`}
          >
            <input
              type="radio"
              name="tipo-motor"
              checked={indice === activo}
              onChange={() => setActivo(indice)}
              className="sr-only"
            />
            {panel.titulo}
          </label>
        ))}
      </div>

      <div className="mt-10 grid">
        {paneles.map((panel, indice) => (
          <div
            key={panel.titulo}
            data-posicion={posicion(indice, activo)}
            className="garantia-panel grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"
          >
            <div className="garantia-foto relative h-[300px] overflow-hidden rounded-[28px] bg-guirose-espuma lg:h-[460px]">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  aria-hidden="true"
                  className="garantia-onda pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-guirose-accion lg:h-[420px] lg:w-[420px]"
                  style={{ animationDelay: `${n * 1.6}s` }}
                />
              ))}
              <div className="absolute inset-8">{panel.imagen}</div>
              <span
                className={`absolute left-6 top-6 rounded-full px-5 py-2 text-[15px] font-bold tracking-[0.04em] text-white ${colores[panel.color]}`}
              >
                {panel.etiqueta}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {panel.usos.map((uso) => {
                const { nombre, Icono } = detalleUso[uso.uso];
                const unidad = uso.anios === 1 ? "año" : "años";

                return (
                  <div key={uso.uso} className="garantia-uso">
                    <div className="grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-[18px] border border-guirose-espuma-fuerte bg-white px-5 py-4 transition duration-200 ease-out hover:translate-x-1.5 hover:border-guirose-accion hover:shadow-[0_10px_24px_-14px_rgba(0,105,217,0.5)] lg:gap-5 lg:px-7 lg:py-5">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-guirose-accion text-white">
                        <Icono aria-hidden="true" className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-guirose-marino lg:text-xl">
                          {nombre}
                        </p>
                        <p className="text-base text-guirose-texto">
                          {uso.leyenda}
                        </p>
                      </div>
                      <p
                        aria-hidden="true"
                        className="flex items-baseline gap-2 text-guirose-accion"
                      >
                        <span
                          className="garantia-cifra text-5xl font-bold leading-none tracking-[-0.03em] lg:text-[64px]"
                          style={{ "--t": uso.anios } as CSSProperties}
                        />
                        <span className="text-xl font-semibold">{unidad}</span>
                      </p>
                      <span className="sr-only">
                        {uso.anios} {unidad}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

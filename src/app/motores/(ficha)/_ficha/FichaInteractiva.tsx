"use client";

import { useState, type ReactNode } from "react";
import Boton from "@/ui/Boton";
import FichaTecnica from "@/ui/FichaTecnica";
import type { VistaVariante } from "@/contenido/motores";

type Fila = { etiqueta: string; valor: string };

type PropsFichaInteractiva = {
  imagen: ReactNode;
  tipoNombre: string;
  linea: string;
  hp: number;
  descripcion: string;
  cilindrada: string;
  rangoPeso: string;
  rangoAltura: string;
  modelos: VistaVariante[];
  base: Fila[];
};

export default function FichaInteractiva({
  imagen,
  tipoNombre,
  linea,
  hp,
  descripcion,
  cilindrada,
  rangoPeso,
  rangoAltura,
  modelos,
  base,
}: PropsFichaInteractiva) {
  // Código del modelo elegido
  const [elegido, setElegido] = useState<string | null>(null);
  const modelo = modelos.find((m) => m.codigo === elegido);

  // Cambio de modelo
  const alternar = (codigo: string) =>
    setElegido((actual) => (actual === codigo ? null : codigo));

  const claves = [
    { valor: cilindrada, etiqueta: "Cilindrada" },
    { valor: modelo ? modelo.peso : rangoPeso, etiqueta: "Peso" },
    { valor: modelo ? modelo.alturaCorta : rangoAltura, etiqueta: "Altura" },
  ];

  const configuracion = modelo
    ? [
        { etiqueta: "Modelo", valor: modelo.codigo },
        { etiqueta: "Control de aceleración", valor: modelo.control },
        { etiqueta: "Altura de transmisión", valor: modelo.altura },
        { etiqueta: "Inclinación", valor: modelo.inclinacion },
        { etiqueta: "Peso", valor: modelo.peso },
      ]
    : undefined;

  return (
    <>
      <section
        aria-label={`Mercury ${linea} ${hp} HP`}
        className="grid items-center gap-8 pb-4 lg:grid-cols-2 lg:gap-14"
      >
        {imagen}

        <div>
          <div className="flex gap-2">
            <span className="rounded-full bg-guirose-accion px-3 py-1 text-sm font-semibold text-white">
              {tipoNombre}
            </span>
            <span className="rounded-full border border-guirose-accion px-3 py-1 text-sm font-semibold text-guirose-accion">
              {linea}
            </span>
          </div>

          <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[44px]">
            Mercury {linea} {hp} HP
          </h1>
          <p className="mt-3 max-w-[560px] text-base text-guirose-texto lg:text-lg">
            {descripcion}
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-guirose-espuma-fuerte py-4">
            {claves.map((c) => (
              <div key={c.etiqueta}>
                <dd className="whitespace-nowrap text-lg font-bold text-guirose-marino lg:text-xl">
                  {c.valor}
                </dd>
                <dt className="text-sm text-guirose-texto">{c.etiqueta}</dt>
              </div>
            ))}
          </dl>

          <div role="group" aria-label={`Modelos de ${hp} HP`} className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-guirose-marino">
                Revisa los modelos de {hp} HP
              </p>
              <button
                type="button"
                onClick={() => setElegido(null)}
                className={`min-h-11 text-sm font-semibold text-guirose-accion underline underline-offset-4 ${
                  elegido ? "" : "invisible"
                }`}
              >
                Quitar selección
              </button>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-2">
              {modelos.map((m) => {
                const activo = m.codigo === elegido;
                return (
                  <button
                    key={m.codigo}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => alternar(m.codigo)}
                    className={`rounded-lg border px-4 py-3 text-left transition duration-150 ease-out active:scale-[0.97] ${
                      activo
                        ? "border-guirose-accion bg-white ring-2 ring-guirose-accion/20"
                        : "border-guirose-borde bg-white hover:border-guirose-accion"
                    }`}
                  >
                    <b className="block text-base text-guirose-marino">
                      {m.codigo}
                    </b>
                    <span className="block text-sm text-guirose-texto">
                      {m.control}
                      <span className="hidden lg:inline"> · </span>
                      <br className="lg:hidden" />
                      {m.alturaCorta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Boton
            href="#"
            variante="relleno"
            className="mt-6 h-14 justify-center gap-3 px-6 text-lg font-semibold lg:w-fit"
          >
            {modelo ? `Cotizar el ${modelo.codigo}` : "Cotizar este motor"}
          </Boton>
          <p className="mt-3 text-sm text-guirose-texto">
            Puedes revisar cada modelo o elegir el control y la altura al
            cotizar. *Imagen referencial.
          </p>
        </div>
      </section>

      <FichaTecnica hp={hp} base={base} configuracion={configuracion} />
    </>
  );
}

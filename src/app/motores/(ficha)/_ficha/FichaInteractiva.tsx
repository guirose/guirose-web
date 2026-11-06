"use client";

import { useState, type ReactNode } from "react";
import Boton from "@/ui/Boton";
import FichaTecnica from "@/ui/FichaTecnica";
import type { VistaVariante } from "@/contenido/motores";

type Fila = { etiqueta: string; valor: string };

type PropsFichaInteractiva = {
  barra: ReactNode; // migas y flechas, armadas en el servidor
  imagen: ReactNode; // la foto, ya armada en el servidor
  tipoNombre: string; // "4 tiempos"
  linea: string; // "SeaPro"
  hp: number;
  descripcion: string;
  cilindrada: string;
  rangoPeso: string; // "165 – 172 kg"
  rangoAltura: string; // "20–25″"
  modelos: VistaVariante[];
  base: Fila[];
  children: ReactNode; // lo que va debajo (la banda)
};

export default function FichaInteractiva({
  barra,
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
  children,
}: PropsFichaInteractiva) {
  // Código del modelo elegido
  const [elegido, setElegido] = useState<string | null>(null);
  const modelo = modelos.find((m) => m.codigo === elegido);

  // Tocar el modelo elegido lo deselecciona
  const alternar = (codigo: string) =>
    setElegido((actual) => (actual === codigo ? null : codigo));

  const textoCta = modelo
    ? `Cotizar el ${modelo.codigo}`
    : "Cotizar este motor";

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
    <div>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[67px]">
        {barra}

        <section
          aria-label={`Mercury ${linea} ${hp} HP`}
          className="relative isolate mt-4 overflow-hidden rounded-[28px] bg-guirose-espuma px-6 py-8 lg:px-14 lg:py-14"
        >
          <span
            aria-hidden="true"
            className="ficha-numero pointer-events-none absolute -bottom-[0.12em] -left-[0.04em] -z-10 select-none text-[190px] font-extrabold leading-none tracking-[-0.04em] text-guirose-accion/10 lg:text-[340px]"
          >
            {hp}
          </span>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            {imagen}
            <div className="ficha-info">
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

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                {claves.map((c) => (
                  <div 
                    key={c.etiqueta}
                    className="border-l-2 border-guirose-accion pl-4"  
                  >
                    <dd className="whitespace-nowrap text-lg font-bold text-guirose-marino lg:text-xl">
                      {c.valor}
                    </dd>
                    <dt className="text-sm text-guirose-texto">{c.etiqueta}</dt>
                  </div>
                ))}
              </dl>

              <div
                role="group"
                aria-label={`Modelos de ${hp} HP`}
                className="mt-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-guirose-marino">
                    Revisa los modelos de {hp} HP
                  </p>
                  {/* invisible conserva el espacio, así nada salta al elegir */}
                  <button
                    type="button"
                    onClick={() => setElegido(null)}
                    className={`min-h-11 touch-manipulation text-sm font-semibold text-guirose-accion underline underline-offset-4 ${
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
                        className={`touch-manipulation rounded-lg border px-4 py-3 text-left transition duration-150 ease-out active:scale-[0.97] ${
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

              {/* Escritorio */}
              <div className="mt-6 hidden lg:block">
                <Boton
                  href="#"
                  variante="relleno"
                  className="h-14 w-fit justify-center gap-3 px-6 text-lg font-semibold"
                >
                  {textoCta}
                </Boton>
              </div>
              <p className="mt-3 text-sm text-guirose-texto">
                Puedes revisar cada modelo o elegir el control y la altura al
                cotizar. *Imagen referencial.
              </p>
            </div>
          </div>
        </section>

        <FichaTecnica hp={hp} base={base} configuracion={configuracion} />
      </div>

      {children}

      {/* Celular */}
      <div className="sticky bottom-0 z-30 border-t border-guirose-espuma-fuerte bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <Boton
          href="#"
          variante="relleno"
          className="h-14 w-full justify-center gap-3 text-lg font-semibold"
        >
          {textoCta}
        </Boton>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  CaretDownIcon,
  CheckIcon,
  PlusIcon,
} from "@phosphor-icons/react/ssr";
import type {
  GrupoDeMedidas,
  GrupoMedida,
  ItemEquipamiento,
} from "@/contenido/equipamiento";
import {
  describirItem,
  detalleBateria,
  etiquetaOpcion,
  marcaCable,
  masGrande,
} from "@/contenido/accesorios";
import FotoAccesorio from "./FotoAccesorio";

type Props = {
  grupos: GrupoDeMedidas[];
  opcionales: ItemEquipamiento[];
};

const CONSULTAR = "consultar"; // "No estoy seguro"
const NINGUNA = "ninguna"; // "No necesito extensión"

// Frase de ayuda
const AYUDA: Record<GrupoMedida, (g: GrupoDeMedidas) => string> = {
  helice: () => "Elige el paso que necesita tu embarcación",
  cable: (g) => `Van ${g.opciones[0].cantidad} unidades. Elige marca y largo`,
  llave: () => "Incluye el arnés eléctrico. Elige su largo",
  extension: () => "Suma una extensión si lo necesitas",
};


// texto en cada opcion
const textoOpcion = (o: ItemEquipamiento) => {
  const marca = marcaCable(o);
  return marca ? `${marca} - ${etiquetaOpcion(o)}` : etiquetaOpcion(o);
};


// item elegido
const valorInicial = (g: GrupoDeMedidas): string =>
  g.grupo === "extension" ? NINGUNA : masGrande(g.opciones).descripcion;

// Agrupa opciones por marca
function porMarca(opciones: ItemEquipamiento[]) {
  const mapa = new Map<string, ItemEquipamiento[]>();
  for (const o of opciones) {
    const marca = marcaCable(o) ?? "";
    mapa.set(marca, [...(mapa.get(marca) ?? []), o]);
  }
  return [...mapa];
}

export default function SeccionMedidas({ grupos, opcionales }: Props) {
  // elección del cliente
  const [eleccion, setEleccion] = useState<Record<string, string>>(() =>
    Object.fromEntries(grupos.map((g) => [g.grupo, valorInicial(g)])),
  );
  // accesorios opcionales agregados
  const [agregados, setAgregados] = useState<string[]>([]);

  const alternar = (descripcion: string) =>
    setAgregados((actual) =>
      actual.includes(descripcion) ? actual.filter((d) => d !== descripcion) : [...actual, descripcion],
    );

  return (
    <section aria-labelledby="titulo-agregar" className="py-8 lg:py-12">
      <h2
        id="titulo-agregar"
        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[36px]"
      >
        Accesorios que puedes agregar
      </h2>
      <p className="mt-3 max-w-[640px] txt-lg text-guirose-texto">
        Elige la medida de lo que necesita tu motor y suma lo que quieras.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {grupos.map((g) => {
          const datos = describirItem(g.opciones[0]);
          const esExtension = g.grupo === "extension";
          const idTitulo = `titulo-${g.grupo}`;
          const valor = eleccion[g.grupo];
          const marcas = porMarca(g.opciones);

          return (
            <article
              key={g.grupo}
              className="rounded-2xl border border-guirose-espuma-fuerte bg-guirose-espuma/40 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <FotoAccesorio foto={datos.foto} className="h-24 w-24" />
                <div className="min-w-0">
                  <h3
                    id={idTitulo}
                    className="text-[22px] font-bold leading-tight text-guirose-marino"
                  >
                    {esExtension ? "¿El arnés no te alcanza?" : g.titulo}
                  </h3>
                  <p className="mt-1 text-base text-guirose-texto">
                    {AYUDA[g.grupo](g)}
                  </p>
                  {esExtension && (
                    <span className="mt-2 inline-block rounded-full border border-guirose-accion px-3 py-0.5 text-sm font-semibold text-guirose-accion">
                      Opcional
                    </span>
                  )}
                </div>
              </div>

              {/* Barra desplegable */}
              <div className="relative mt-5">
                <select
                  aria-labelledby={idTitulo}
                  value={valor}
                  onChange={(e) =>
                    setEleccion((actual) => ({
                      ...actual,
                      [g.grupo]: e.target.value,
                    }))
                  }
                  className="h-14 w-full cursor-pointer touch-manipulation appearance-none rounded-xl border-[1.5px] border-guirose-borde bg-white pr-12 pl-4 text-lg font-semibold text-guirose-marino transition duration-150 ease-out hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul"
                >
                  {esExtension && (
                    <option value={NINGUNA}>No necesito extensión</option>
                  )}
                  {marcas.length > 1
                    ? marcas.map(([marca, lista]) => (
                        <optgroup key={marca} label={marca}>
                          {lista.map((o) => (
                            <option key={o.descripcion} value={o.descripcion}>
                              {textoOpcion(o)}
                            </option>
                          ))}
                        </optgroup>
                      ))
                    : g.opciones.map((o) => (
                        <option key={o.descripcion} value={o.descripcion}>
                          {textoOpcion(o)}
                        </option>
                      ))}
                  <option value={CONSULTAR}>
                    No estoy seguro, que me asesoren
                  </option>
                </select>
                <CaretDownIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-guirose-marino"
                />
              </div>

              <p
                aria-live="polite"
                className="mt-2 min-h-6 text-sm text-guirose-texto"
              >
                {valor === CONSULTAR ? "Perfecto, tu asesor te ayudará a elegir." : ""}
              </p>
            </article>
          );
        })}
      </div>

      {opcionales.map((o) => {
        const datos = describirItem(o);
        const detalle = detalleBateria(o)?.split(" - ");
        const agregado = agregados.includes(o.descripcion);
        return (
          <div
            key={o.descripcion}
            className="mt-5 flex flex-col gap-4 rounded-2xl border border-guirose-espuma-fuerte p-5 sm:flex-row sm:items-center sm:p-6"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <FotoAccesorio
                foto={datos.foto}
                className="h-24 w-24 bg-guirose-espuma/40"
              />
              <div className="min-w-0">
                <span className="rounded-full border border-guirose-accion px-3 py-0.5 text-sm font-semibold text-guirose-accion">
                  Opcional
                </span>
                <h3 className="mt-2 text-[22px] font-bold leading-tight text-guirose-marino">
                  {datos.nombre} {detalle?.[0]}
                </h3>
                <p className="text-base text-guirose-texto">
                  {detalle?.slice(1).join(" - ")}
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-pressed={agregado}
              onClick={() => alternar(o.descripcion)}
              className={`flex h-14 touch-manipulation select-none items-center justify-center gap-2 rounded-[5px] border-2 px-6 text-lg font-semibold transition duration-150 ease-out active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul sm:w-48 ${
                agregado
                  ? "border-guirose-marino bg-guirose-marino text-white"
                  : "border-guirose-accion text-guirose-accion hover:bg-guirose-accion hover:text-white"
              }`}
            >
              {agregado ? (
                <CheckIcon aria-hidden="true" className="h-5 w-5" />
              ) : (
                <PlusIcon aria-hidden="true" className="h-5 w-5" />
              )}
              {agregado ? "Agregada" : "Agregar"}
            </button>
          </div>
        );
      })}
    </section>
  );
}
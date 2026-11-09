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
  descripcionDetallada,
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
  helice: () => "Elige el paso que necesita tu embarcación.",
  cable: (g) => `Van ${g.opciones[0].cantidad} unidades. Elige marca y largo.`,
  llave: () => "Incluye el arnés eléctrico. Elige su largo.",
  extension: () => "Suma una extensión si lo necesitas.",
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

const tarjeta = "flex flex-col overflow-hidden rounded-2xl border border-guirose-espuma-fuerte bg-white";
const fotoGrande = "h-36 w-full bg-guirose-espuma/60 sm:h-44";
const etiquetaOpcional = "absolute top-3 left-3 rounded-full bg-white px-3 py-0.5 text-sm font-semibold text-guirose-accion ring-1 ring-guirose-accion";

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
    <section
      aria-labelledby="titulo-agregar"
      className="pt-6 pb-8 lg:pt-8 lg:pb-12"
    >
      <h2
        id="titulo-agregar"
        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[36px]"
      >
        Accesorios que puedes agregar
      </h2>
      <p className="mt-3 max-w-[640px] text-lg text-guirose-texto">
        Elige la medida de lo que necesita tu motor y suma lo que quieras. Si
        tienes dudas, tu asesor te ayuda por WhatsApp.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Accesorios con medida: barra desplegable */}
        {grupos.map((g) => {
          const datos = describirItem(g.opciones[0]);
          const esExtension = g.grupo === "extension";
          const idTitulo = `titulo-${g.grupo}`;
          const valor = eleccion[g.grupo];
          const elegido = g.opciones.find((o) => o.descripcion === valor);
          const marcas = porMarca(g.opciones);

          return (
            <article key={g.grupo} className={tarjeta}>
              <div className="relative">
                <FotoAccesorio foto={datos.foto} className={fotoGrande} />
                {esExtension && (
                  <span className={etiquetaOpcional}>Opcional</span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3
                  id={idTitulo}
                  className="text-xl font-bold leading-tight text-guirose-marino"
                >
                  {esExtension ? "¿El arnés no te alcanza?" : g.titulo}
                </h3>
                <p className="mt-1.5 text-base text-guirose-texto">
                  {AYUDA[g.grupo](g)}
                </p>

                {/* mt-auto empuja la barra al fondo para que todas queden alineadas */}
                <div className="relative mt-auto pt-5">
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
                    <option value={CONSULTAR}>No estoy seguro</option>
                  </select>
                  <CaretDownIcon
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 bottom-[18px] h-5 w-5 text-guirose-marino"
                  />
                </div>

                <div aria-live="polite" className="min-h-[4.75rem]">
                  {elegido && (
                    <p className="mt-3 text-sm leading-snug text-guirose-texto">
                      {descripcionDetallada(elegido)}
                    </p>
                  )}
                  {valor === CONSULTAR && (
                    <p className="mt-3 text-sm text-guirose-texto">
                      Perfecto, un asesor te ayudará a elegir.
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {/* Accesorios opcionales: botón Agregar. Si hay más de uno, siguen en la misma cuadrícula */}
        {opcionales.map((o) => {
          const datos = describirItem(o);
          const detalle = detalleBateria(o)?.split(" · ");
          const agregado = agregados.includes(o.descripcion);

          return (
            <article key={o.descripcion} className={tarjeta}>
              <div className="relative">
                <FotoAccesorio foto={datos.foto} className={fotoGrande} />
                <span className={etiquetaOpcional}>Opcional</span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-bold leading-tight text-guirose-marino">
                  {datos.nombre} {detalle?.[0]}
                </h3>
                {detalle && detalle.length > 1 && (
                  <p className="mt-1.5 text-base text-guirose-texto">
                    {detalle.slice(1).join(" · ")}
                  </p>
                )}

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    aria-pressed={agregado}
                    onClick={() => alternar(o.descripcion)}
                    className={`flex h-14 w-full touch-manipulation select-none items-center justify-center gap-2 rounded-xl border-2 px-6 text-lg font-semibold transition duration-150 ease-out active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul ${
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
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
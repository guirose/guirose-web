"use client";

import { useState } from "react";
import {
  CaretDownIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
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
  metrosOpcion,
  tamanoOpcion,
} from "@/contenido/accesorios";
import FotoAccesorio from "./FotoAccesorio";

type Props = {
  grupos: GrupoDeMedidas[];
  opcionales: ItemEquipamiento[];
};

const CONSULTAR = "consultar"; // "No estoy seguro"
const MAX_CANTIDAD = 5; // "Máximo de unidades de una misma medida"

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

// Agrupa opciones por marca
function porMarca(opciones: ItemEquipamiento[]) {
  const mapa = new Map<string, ItemEquipamiento[]>();
  for (const o of opciones) {
    const marca = marcaCable(o) ?? "";
    mapa.set(marca, [...(mapa.get(marca) ?? []), o]);
  }
  return [...mapa];
}

// Estilos que comparten todas las tarjetas
const tarjeta = "flex flex-col overflow-hidden rounded-2xl border border-guirose-espuma-fuerte bg-white";
const fotoGrande = "h-36 w-full bg-guirose-espuma/60 sm:h-44";
const etiquetaOpcional = "absolute top-3 left-3 rounded-full bg-white px-3 py-0.5 text-sm font-semibold text-guirose-accion ring-1 ring-guirose-accion";
const barra = "h-14 w-full cursor-pointer touch-manipulation appearance-none rounded-xl border-[1.5px] border-guirose-borde bg-white pr-12 pl-4 text-lg font-semibold text-guirose-marino transition duration-150 ease-out hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul";
const botonCantidad = "flex h-11 w-11 touch-manipulation select-none items-center justify-center rounded-lg border-[1.5px] border-guirose-borde bg-white text-guirose-marino transition duration-150 ease-out active:scale-[0.95] hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul disabled:cursor-not-allowed disabled:opacity-40";
const botonSecundario = "inline-flex min-h-11 touch-manipulation select-none items-center gap-2 rounded-[10px] border-[1.5px] border-guirose-borde bg-white px-4 text-base font-semibold text-guirose-marino transition duration-150 ease-out active:scale-[0.97] hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul disabled:cursor-not-allowed disabled:opacity-40";

// Botones - [n] + de una fila
function Cantidad({
  valor,
  nombre,
  onCambiar,
}: {
  valor: number;
  nombre: string;
  onCambiar: (cantidad: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Una menos de ${nombre}`}
        disabled={valor <= 0}
        onClick={() => onCambiar(valor - 1)}
        className={botonCantidad}
      >
        <MinusIcon aria-hidden="true" className="h-5 w-5" />
      </button>
      <span className="w-6 text-center text-lg font-bold text-guirose-marino">
        {valor}
      </span>
      <button
        type="button"
        aria-label={`Una más de ${nombre}`}
        disabled={valor >= MAX_CANTIDAD}
        onClick={() => onCambiar(valor + 1)}
        className={`${botonCantidad}`}
      >
        <PlusIcon aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}

type PropsExtension = {
  grupo: GrupoDeMedidas;
  cantidades: Record<string, number>;
  consultar: boolean;
  onCambiar: (valor: string, cantidad: number) => void;
  onAlternarConsulta: () => void;
  onQuitarTodo: () => void;
};

// extensión de arnés tiene varias meddias y cantidad de cada una
function FilaExtension({
  grupo,
  cantidades,
  consultar,
  onCambiar,
  onAlternarConsulta,
  onQuitarTodo,
}: PropsExtension) {
  const datos = describirItem(grupo.opciones[0]);
  const opciones = [...grupo.opciones].sort(
    (a, b) => tamanoOpcion(a) - tamanoOpcion(b),
  );
  const total = opciones.reduce((suma, o) => suma + (cantidades[o.descripcion] ?? 0), 0);

  return (
    <article className="mt-5 grid gap-6 rounded-2xl border border-guirose-espuma-fuerte bg-white p-5 sm:p-6 lg:grid-cols-[380px_1fr] lg:items-center lg:gap-9">
      <div className="flex items-start gap-5">
        <div className="relative h-[104px] w-[104px] shrink-0 lg:h-[150px] lg:w-[150px]">
          <FotoAccesorio
            foto={datos.foto}
            className="h-full w-full rounded-2xl bg-guirose-espuma/60"
          />
          <span className={etiquetaOpcional}>Opcional</span>
        </div>

        <div className="min-w-0">
          <h3
            id="titulo-extension"
            className="text-xl leading-tight font-bold text-guirose-marino lg:text-[22px]"
          >
            ¿El arnés no te alcanza?
          </h3>
          <p className="mt-1.5 text-base text-guirose-texto">
            {AYUDA.extension(grupo)}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            {total > 0 && (
              <span
                aria-live="polite"
                className="rounded-full bg-guirose-espuma px-3.5 py-1 text-[15px] font-bold text-guirose-accion"
              >
                Total: {total} {total === 1 ? "extensión" : "extensiones"}
              </span>
            )}
            <button
              type="button"
              disabled={total === 0 && !consultar}
              onClick={onQuitarTodo}
              className={botonSecundario}
            >
              <TrashIcon aria-hidden="true" className="h-[18px] w-[18px]" />
              Quitar todo
            </button>
          </div>
        </div>
      </div>

      <ul
        aria-labelledby="titulo-extension"
        className="grid gap-3 sm:grid-cols-2 min-[1360px]:grid-cols-3"
      >
        {opciones.map((o) => {
          const cantidad = cantidades[o.descripcion] ?? 0;
          return (
            <li
              key={o.descripcion}
              className={`flex items-center justify-between gap-2 rounded-[14px] border-[1.5px] py-2 pr-2 pl-4 ${
                cantidad > 0
                  ? "border-guirose-accion bg-guirose-espuma"
                  : "border-guirose-borde bg-white"
              }`}
            >
              <div>
                <span className="block text-xl leading-tight font-bold text-guirose-marino">
                  {etiquetaOpcion(o)}
                </span>
                {metrosOpcion(o) && (
                  <span className="block text-sm text-guirose-texto">
                    {metrosOpcion(o)}
                  </span>
                )}
              </div>
              <Cantidad
                valor={cantidad}
                nombre={`extensión de ${etiquetaOpcion(o)}`}
                onCambiar={(n) => onCambiar(o.descripcion, n)}
              />
            </li>
          );
        })}

        <li className="sm:col-span-2 min-[1360px]:col-span-3">
          <button
            type="button"
            aria-pressed={consultar}
            onClick={onAlternarConsulta}
            className="flex min-h-12 w-full touch-manipulation select-none items-center gap-3 rounded-[14px] border-[1.5px] border-dashed border-[#B9CBDD] bg-white px-4 text-left text-[17px] font-semibold text-guirose-marino transition duration-150 ease-out hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul"
          >
            <span
              aria-hidden="true"
              className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 ${
                consultar
                  ? "border-guirose-accion bg-guirose-accion text-white"
                  : "border-[#9FB3C8] bg-white"
              }`}
            >
              {consultar && <CheckIcon className="h-3.5 w-3.5" weight="bold" />}
            </span>
            No estoy seguro, que me asesoren
          </button>
          <div aria-live="polite">
            {consultar && (
              <p className="mt-2 text-sm text-guirose-texto">
                Perfecto, un asesor te ayudará a elegir.
              </p>
            )}
          </div>
        </li>
      </ul>
    </article>
  );
}

export default function SeccionMedidas({ grupos, opcionales }: Props) {
  // elección del cliente
  const [eleccion, setEleccion] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      grupos
        .filter((g) => g.grupo !== "extension")
        .map((g) => [g.grupo, masGrande(g.opciones).descripcion])
    ),
  );
  // extensiones: descripciones, cantidad
  const [extensiones, setExtensiones] = useState<Record<string, number>>({});
  const [extConsultar, setExtConsultar] = useState(false);
  // accesorios opcionales agregados
  const [agregados, setAgregados] = useState<string[]>([]);

  const cambiarExtension = (valor: string, cantidad: number) =>
    setExtensiones((actual) => {
      const copia = {...actual};
      if (cantidad <= 0) delete copia[valor];
      else copia[valor] = Math.min(cantidad, MAX_CANTIDAD);
      return copia;
    });

  const quitarTodasLasExtensiones = () => {
    setExtensiones({});
    setExtConsultar(false);
  };

  const alternar = (descripcion: string) =>
    setAgregados((actual) =>
      actual.includes(descripcion)
        ? actual.filter((d) => d !== descripcion)
        : [...actual, descripcion],
    );

  const conBarra = grupos.filter((g) => g.grupo !== "extension");
  const grupoExtension = grupos.find((g) => g.grupo === "extension");

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

      {/* accesorios de una sola medida (barra) y opcionales (botón) */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {conBarra.map((g) => {
          const datos = describirItem(g.opciones[0]);
          const idTitulo = `titulo-${g.grupo}`;
          const valor = eleccion[g.grupo];
          const elegido = g.opciones.find((o) => o.descripcion === valor);
          const marcas = porMarca(g.opciones);

          return (
            <article key={g.grupo} className={tarjeta}>
              <div className="relative">
                <FotoAccesorio foto={datos.foto} className={fotoGrande} />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3
                  id={idTitulo}
                  className="text-xl font-bold leading-tight text-guirose-marino"
                >
                  {g.titulo}
                </h3>
                <p className="mt-1.5 text-base text-guirose-texto">
                  {AYUDA[g.grupo](g)}
                </p>

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
                    className={barra}
                  >
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

        {opcionales.map((o) => {
          const datos = describirItem(o);
          const detalle = detalleBateria(o)?.split(" - ");
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
                    {detalle.slice(1).join(" - ")}
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

      {/* extensión de arnés con varias medidas y cantidad */}
      {grupoExtension && (
        <FilaExtension
          grupo={grupoExtension}
          cantidades={extensiones}
          consultar={extConsultar}
          onCambiar={cambiarExtension}
          onAlternarConsulta={() => setExtConsultar((actual) => !actual)}
          onQuitarTodo={quitarTodasLasExtensiones}
        />
      )}
    </section>
  );
}
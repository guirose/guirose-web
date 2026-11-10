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
const MAX_CANTIDAD = 5; // máximo de unidades de una misma medida

// Frase de ayuda
const AYUDA: Record<GrupoMedida, (g: GrupoDeMedidas) => string> = {
  helice: () => "Elige el paso de tu embarcación.",
  cable: (g) => `Van ${g.opciones[0].cantidad} unidades. Elige marca y largo.`,
  llave: () => "Incluye el arnés. Elige su largo.",
  extension: () => "Elige medidas y cantidad.",
};

// texto en cada opción
const textoOpcion = (o: ItemEquipamiento) => {
  const marca = marcaCable(o);
  return marca ? `${marca} - ${etiquetaOpcion(o)}` : etiquetaOpcion(o);
};

function detalleCorto(grupo: GrupoMedida, o: ItemEquipamiento) {
  const metros = metrosOpcion(o);
  if (grupo === "cable") return metros ? `Largo: ${metros}` : undefined;
  if (grupo === "llave") return metros ? `Arnés de ${metros}` : undefined;
  if (grupo === "helice") {
    const aspas = o.descripcion.match(/\((\d+)X\d+X\d+\)/);
    const material = /ALUMINIO/.test(o.descripcion) ? "Aluminio" : undefined;
    return [material, aspas ? `${aspas[1]} aspas` : undefined]
      .filter(Boolean)
      .join(", ");
  }
  return undefined;
}

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
const fotoGrande = "h-32 w-full bg-guirose-espuma/60 sm:h-36";
const etiquetaOpcional = "absolute top-3 left-3 rounded-full bg-white px-3 py-0.5 text-sm font-semibold text-guirose-accion ring-1 ring-guirose-accion";
const etiquetaPequena = "absolute -top-1.5 -left-1.5 rounded-full bg-white px-2.5 py-px text-[13px] font-semibold text-guirose-accion ring-1 ring-guirose-accion";
const barra = "h-13 w-full cursor-pointer touch-manipulation appearance-none rounded-xl border-[1.5px] border-guirose-borde bg-white pr-12 pl-4 text-[17px] font-semibold text-guirose-marino transition duration-150 ease-out hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul";
const botonCantidad = "flex h-11 w-11 touch-manipulation select-none items-center justify-center rounded-lg border-[1.5px] border-guirose-borde bg-white text-guirose-marino transition duration-150 ease-out active:scale-[0.95] hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul disabled:cursor-not-allowed disabled:opacity-40";
const botonSecundario = "inline-flex min-h-11 touch-manipulation select-none items-center gap-2 rounded-[10px] border-[1.5px] border-guirose-borde bg-white px-4 text-[15px] font-semibold text-guirose-marino transition duration-150 ease-out active:scale-[0.97] hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul disabled:cursor-not-allowed disabled:opacity-40";

// Botones - [n] + de una medida
function Cantidad({
  valor,
  nombre,
  bloqueado,
  onCambiar,
}: {
  valor: number;
  nombre: string;
  bloqueado: boolean;
  onCambiar: (cantidad: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 sm:justify-start">
      <button
        type="button"
        aria-label={`Una menos de ${nombre}`}
        disabled={bloqueado || valor <= 0}
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
        disabled={bloqueado || valor >= MAX_CANTIDAD}
        onClick={() => onCambiar(valor + 1)}
        className={botonCantidad}
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

function FilaExtension({
  grupo,
  cantidades,
  consultar,
  onCambiar,
  onAlternarConsulta,
  onQuitarTodo,
}: PropsExtension) {
  const datos = describirItem(grupo.opciones[0]);
  // de menor a mayor largo
  const opciones = [...grupo.opciones].sort(
    (a, b) => tamanoOpcion(a) - tamanoOpcion(b),
  );
  const total = opciones.reduce(
    (suma, o) => suma + (cantidades[o.descripcion] ?? 0),
    0,
  );

  return (
    <article className="mt-5 grid gap-5 rounded-2xl border border-guirose-espuma-fuerte bg-white p-4 sm:p-5 lg:grid-cols-[350px_1fr] lg:items-center lg:gap-7">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative h-23 w-23 shrink-0">
            <FotoAccesorio
              foto={datos.foto}
              className="h-full w-full rounded-xl bg-guirose-espuma/60"
            />
            <span className={etiquetaPequena}>Opcional</span>
          </div>
          <div className="min-w-0">
            <h3
              id="titulo-extension"
              className="text-xl leading-tight font-bold text-guirose-marino"
            >
              ¿El arnés no te alcanza?
            </h3>
            <p className="mt-1 text-[15px] leading-snug text-guirose-texto">
              {AYUDA.extension(grupo)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {total > 0 && (
            <span
              aria-live="polite"
              className="rounded-full bg-guirose-espuma px-3 py-0.5 text-sm font-bold text-guirose-accion"
            >
              Total: {total} {total === 1 ? "extensión" : "extensiones"}
            </span>
          )}
          <button
            type="button"
            disabled={total === 0}
            onClick={onQuitarTodo}
            className={botonSecundario}
          >
            <TrashIcon aria-hidden="true" className="h-[18px] w-[18px]" />
            Quitar todo
          </button>
        </div>

        {/* "No estoy seguro" borra y bloquea las medidas */}
        <button
          type="button"
          aria-pressed={consultar}
          onClick={onAlternarConsulta}
          className={`flex w-full touch-manipulation select-none items-start gap-3 rounded-[14px] border-[1.5px] px-3.5 py-2.5 text-left transition duration-150 ease-out focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul ${
            consultar
              ? "border-guirose-accion bg-guirose-espuma"
              : "border-dashed border-[#B9CBDD] bg-white hover:border-guirose-accion"
          }`}
        >
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-md border-2 ${
              consultar
                ? "border-guirose-accion bg-guirose-accion text-white"
                : "border-[#9FB3C8] bg-white"
            }`}
          >
            {consultar && <CheckIcon className="h-4 w-4" weight="bold" />}
          </span>
          <span>
            <span className="block text-base leading-snug font-semibold text-guirose-marino">
              No estoy seguro
            </span>
            <span className="block text-sm leading-snug text-guirose-texto">
              {consultar ? "Un asesor te ayudará a elegir." : "Que me asesoren"}
            </span>
          </span>
        </button>
      </div>

      <ul
        aria-labelledby="titulo-extension"
        className="grid grid-cols-2 gap-2.5 min-[1360px]:grid-cols-3"
      >
        {opciones.map((o) => {
          const cantidad = cantidades[o.descripcion] ?? 0;
          return (
            <li
              key={o.descripcion}
              className={`flex flex-col gap-1.5 rounded-[14px] border-[1.5px] py-2 pr-2 pl-3 sm:flex-row sm:items-center sm:justify-between sm:pl-4 ${
                consultar
                  ? "border-[#E3EAF2] bg-[#F5F7FA] opacity-45"
                  : cantidad > 0
                    ? "border-guirose-accion bg-guirose-espuma"
                    : "border-guirose-borde bg-white"
              }`}
            >
              <div className="flex items-baseline gap-2 sm:block">
                <span className="block text-lg leading-tight font-bold text-guirose-marino">
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
                bloqueado={consultar}
                nombre={`extensión de ${etiquetaOpcion(o)}`}
                onCambiar={(n) => onCambiar(o.descripcion, n)}
              />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default function SeccionMedidas({ grupos, opcionales }: Props) {
  // elección del cliente (la extensión se maneja aparte: admite varias medidas)
  const [eleccion, setEleccion] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      grupos
        .filter((g) => g.grupo !== "extension")
        .map((g) => [g.grupo, masGrande(g.opciones).descripcion]),
    ),
  );
  // extensiones: { descripción de la medida: cantidad }
  const [extensiones, setExtensiones] = useState<Record<string, number>>({});
  const [extConsultar, setExtConsultar] = useState(false);
  // accesorios opcionales agregados
  const [agregados, setAgregados] = useState<string[]>([]);

  const cambiarExtension = (valor: string, cantidad: number) =>
    setExtensiones((actual) => {
      const copia = { ...actual };
      if (cantidad <= 0) delete copia[valor];
      else copia[valor] = Math.min(cantidad, MAX_CANTIDAD);
      return copia;
    });

  const quitarTodasLasExtensiones = () => setExtensiones({});

  // Marcar "No estoy seguro" borra las medidas elegidas
  const alternarConsultaExtension = () => {
    if (!extConsultar) setExtensiones({});
    setExtConsultar(!extConsultar);
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

              <div className="flex flex-1 flex-col p-4.5">
                <h3
                  id={idTitulo}
                  className="text-xl font-bold leading-tight text-guirose-marino"
                >
                  {g.titulo}
                </h3>
                <p className="mt-1.5 text-[15px] leading-snug text-guirose-texto">
                  {AYUDA[g.grupo](g)}
                </p>

                <div className="relative mt-auto pt-4">
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
                    className="pointer-events-none absolute right-4 bottom-[17px] h-5 w-5 text-guirose-marino"
                  />
                </div>

                {/* una sola línea, con alto reservado para que no salten las tarjetas */}
                <p
                  aria-live="polite"
                  className="mt-2.5 min-h-5 text-sm leading-snug text-guirose-texto"
                >
                  {valor === CONSULTAR
                    ? "Un asesor te ayudará a elegir."
                    : elegido && detalleCorto(g.grupo, elegido)}
                </p>
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

              <div className="flex flex-1 flex-col p-4.5">
                <h3 className="text-xl font-bold leading-tight text-guirose-marino">
                  {datos.nombre} {detalle?.[0]}
                </h3>
                {detalle && detalle.length > 1 && (
                  <p className="mt-1.5 text-[15px] leading-snug text-guirose-texto">
                    {detalle.slice(1).join(" - ")}
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    aria-pressed={agregado}
                    onClick={() => alternar(o.descripcion)}
                    className={`flex h-13 w-full touch-manipulation select-none items-center justify-center gap-2 rounded-xl border-2 px-6 text-[17px] font-semibold transition duration-150 ease-out active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul ${
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
                <p aria-hidden="true" className="mt-2.5 min-h-5" />
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
          onAlternarConsulta={alternarConsultaExtension}
          onQuitarTodo={quitarTodasLasExtensiones}
        />
      )}
    </section>
  );
}

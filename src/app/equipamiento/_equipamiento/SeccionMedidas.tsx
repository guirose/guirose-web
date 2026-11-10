"use client";

import { useState } from "react";
import {
  CaretDownIcon,
  CheckIcon,
  MinusIcon,
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
  tamanoOpcion,
} from "@/contenido/accesorios";
import FotoAccesorio from "./FotoAccesorio";

type Props = {
  grupos: GrupoDeMedidas[];
  opcionales: ItemEquipamiento[];
};

const CONSULTAR = "consultar"; // "No estoy seguro"
const MAX_CANTIDAD = 20; // "Máximo de unidades de una misma medida"

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
const botonCantidad = "flex h-11 w-11 touch-manipulation select-none items-center justify-center rounded-lg border-[1.5px] border-guirose-borde bg-white text-guirose-marino transition duration-150 ease-out active:scale-[0.95] hover:border-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul";

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
        aria-label={valor === 1 ? `Quitar ${nombre}` : `Una menos de ${nombre}`}
        onClick={() => onCambiar(valor - 1)}
        className={botonCantidad}
      >
        <MinusIcon aria-hidden="true" className="h-5 w-5" />
      </button>
      <span className="w-7 text-center text-lg font-bold text-guirose-marino">
        {valor}
      </span>
      <button
        type="button"
        aria-label={`Una más de ${nombre}`}
        disabled={valor >= MAX_CANTIDAD}
        onClick={() => onCambiar(valor + 1)}
        className={`${botonCantidad} disabled:cursor-not-allowed disabled:opacity-40`}
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
  onAgregar: (valor: string) => void;
  onCambiar: (valor: string, cantidad: number) => void;
  onQuitarConsulta: () => void;
};

// extensión de arnés tiene varias meddias y cantidad de cada una
function TarjetaExtension({
  grupo,
  cantidades,
  consultar,
  onAgregar,
  onCambiar,
  onQuitarConsulta,
}: PropsExtension) {
  const datos = describirItem(grupo.opciones[0]);
  const idTitulo = "titulo-extension";
  const opciones = [...grupo.opciones].sort(
    (a, b) => tamanoOpcion(a) - tamanoOpcion(b),
  );
  const elegidas = opciones.filter((o) => cantidades[o.descripcion] > 0);
  const total = elegidas.reduce((suma, o) => suma + cantidades[o.descripcion], 0);

  return (
    <article className={tarjeta}>
      <div className="relative">
        <FotoAccesorio foto={datos.foto} className={fotoGrande} />
        <span className={etiquetaOpcional}>Opcional</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          id={idTitulo}
          className="text-xl font-bold leading-tight text-guirose-marino"
        >
          ¿El arnés no te alcanza?
        </h3>
        <p className="mt-1.5 text-base text-guirose-texto">
          {AYUDA.extension(grupo)}
        </p>

        {(elegidas.length > 0 || consultar) && (
          <ul className="mt-4 space-y-2">
            {elegidas.map((o) => (
              <li
                key={o.descripcion}
                className="flex items-center justify-between gap-3 rounded-xl bg-guirose-espuma/60 py-1.5 pr-1.5 pl-4"
              >
                <span className="text-lg font-bold text-guirose-marino">
                  {etiquetaOpcion(o)}
                </span>
                <Cantidad
                  valor={cantidades[o.descripcion]}
                  nombre={`extensión de ${etiquetaOpcion(o)}`}
                  onCambiar={(n) => onCambiar(o.descripcion, n)}
                />
              </li>
            ))}
            {consultar && (
              <li className="flex items-center justify-between gap-3 rounded-xl bg-guirose-espuma/60 py-1.5 pr-1.5 pl-4">
                <span className="text-base font-semibold text-guirose-marino">
                  Que me asesoren
                </span>
                <button
                  type="button"
                  aria-label="Quitar la consulta al asesor"
                  onClick={onQuitarConsulta}
                  className={botonCantidad}
                >
                  <MinusIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </li>
            )}
          </ul>
        )}

        <div className="relative mt-auto pt-5">
          <select
            aria-labelledby={idTitulo}
            value=""
            onChange={(e) => onAgregar(e.target.value)}
            className={barra}
          >
            <option value="">Agregar una extensión</option>
            {opciones.map((o) => (
              <option key={o.descripcion} value={o.descripcion}>
                {etiquetaOpcion(o)}
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
          {total > 0 && (
            <p className="mt-3 text-sm font-semibold text-guirose-texto">
              Total: {total} {total === 1 ? "extensión" : "extensiones"}
            </p>
          )}
          {consultar && (
            <p className="mt-2 text-sm text-guirose-texto">
              Perfecto, un asesor te ayudará a elegir.
            </p>
          )}
        </div>
      </div>
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

  const agregarExtension = (valor: string) => {
    if (valor === "") return;
    if (valor === CONSULTAR) {
      setExtConsultar(true);
      return;
    }
    setExtensiones((actual) => ({
      ...actual,
      [valor]: Math.min((actual[valor] ?? 0) + 1, MAX_CANTIDAD),
    }));
  };

  const cambiarExtension = (valor: string, cantidad: number) =>
    setExtensiones((actual) => {
      const copia = {...actual};
      if (cantidad <= 0) delete copia[valor];
      else copia[valor] = Math.min(cantidad, MAX_CANTIDAD);
      return copia;
    });

  const alternar = (descripcion: string) =>
    setAgregados((actual) =>
      actual.includes(descripcion)
        ? actual.filter((d) => d !== descripcion)
        : [...actual, descripcion],
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
          // varias medidas con cantidad para la extension de arnés
          if (g.grupo === "extension") {
            return (
              <TarjetaExtension
                key={g.grupo}
                grupo={g}
                cantidades={extensiones}
                consultar={extConsultar}
                onAgregar={agregarExtension}
                onCambiar={cambiarExtension}
                onQuitarConsulta={() => setExtConsultar(false)}
              />
            );
          }

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

        {/* Accesorios opcionales: botón Agregar. Si hay más de uno, siguen en la misma cuadrícula */}
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
    </section>
  );
}
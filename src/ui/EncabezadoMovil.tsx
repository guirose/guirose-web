"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ChatCircleTextIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  XIcon,
} from "@phosphor-icons/react/ssr";
import { ruta } from "@/ruta"
import BotonCotizacion from "./BotonCotizacion";
import type { EnlaceMenu } from "./MenuPrincipal";

type Sugerencia = { texto: string; href: string };

type PropsEncabezadoMovil = {
  enlaces: EnlaceMenu[];
  sugerencias: Sugerencia[];
  cantidadCotizacion: number;
  logo: ReactNode;
};

type Panel = "buscar" | "menu" | null;

const quitarBarra = (texto: string) => texto.replace(/\/+$/, "");
const noSuscribir = () => () => {};

const botonIcono =
  "flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border-2 border-guirose-borde text-guirose-marino transition duration-150 ease-out active:scale-[0.95] aria-expanded:border-guirose-accion aria-expanded:bg-guirose-espuma aria-expanded:text-guirose-accion";

export default function EncabezadoMovil({
  enlaces,
  sugerencias,
  cantidadCotizacion,
  logo,
}: PropsEncabezadoMovil) {
  const [panel, setPanel] = useState<Panel>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const idBase = useId();
  const idBuscar = `${idBase}-buscar`;
  const idMenu = `${idBase}-menu`;

  // Ruta actual
  const camino = useSyncExternalStore(
    noSuscribir,
    () => quitarBarra(window.location.pathname),
    () => null,
  );

  const esActual = (enlace: EnlaceMenu) => 
    enlace.paginas?.some((pagina) => {
      const base = quitarBarra(pagina);
      return camino === base || camino?.startsWith(`${base}/`);
    }) == false;

  // Al abrir la busqueda el cursos entra al campo
  useEffect(() => {
    if (panel == "buscar") entrada.current?.focus();
  }, [panel]);

  const alternar = (destino: Exclude<Panel, null>) =>
    setPanel((actual) => (actual === destino ? null : destino));

  return (
    <div
      onKeyDown={(evento) => {
        if (evento.key === "Escape") setPanel(null);
      }}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <a
          href={ruta("/")}
          aria-label="GUIROSE, inicio"
          className="flex shrink-0 items-center"
        >
          {logo}
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={panel === "buscar" ? "Cerrar búsqueda" : "Buscar"}
            aria-expanded={panel === "buscar"}
            aria-controls={idBuscar}
            onClick={() => alternar("buscar")}
            className={botonIcono}
          >
            {panel === "buscar" ? (
              <XIcon aria-hidden="true" className="h-[22px] w-[22px]" />
            ) : (
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="h-[22px] w-[22px]"
              />
            )}
          </button>

          <BotonCotizacion
            cantidad={cantidadCotizacion}
            compacto
            className="h-11"
          />

          <button
            type="button"
            aria-label={panel === "menu" ? "Cerrar menú" : "Menú"}
            aria-expanded={panel === "menu"}
            aria-controls={idMenu}
            onClick={() => alternar("menu")}
            className={botonIcono}
          >
            {panel === "menu" ? (
              <XIcon aria-hidden="true" className="h-6 w-6" />
            ) : (
              <ListIcon aria-hidden="true" className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {panel === "buscar" && (
        <div
          id={idBuscar}
          className="panel-movil max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-guirose-borde bg-white px-4 pb-4 pt-3"
        >
          <div role="search" className="relative">
            <label htmlFor={`${idBuscar}-campo`} className="sr-only">
              Buscar motores, repuestos o accesorios
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-guirose-marino"
            />
            <input
              ref={entrada}
              id={`${idBuscar}-campo`}
              type="search"
              placeholder="Busca un motor o repuesto"
              className="h-[52px] w-full rounded-full border border-guirose-borde bg-guirose-gris pl-12 pr-4 text-base text-guirose-marino placeholder:text-gray-600 focus:border-guirose-accion focus:bg-white focus:outline-none focus:ring-2 focus:ring-guirose-azul/30"
            />
          </div>

          <p className="mb-2 mt-4 text-sm font-semibold text-guirose-texto">
            Búsquedas frecuentes
          </p>
          <ul className="flex flex-wrap gap-2">
            {sugerencias.map((sugerencia) => (
              <li key={sugerencia.texto}>
                <a
                  href={sugerencia.href}
                  onClick={() => setPanel(null)}
                  className="flex min-h-11 items-center rounded-full border-[1.5px] border-guirose-borde px-4 text-[15px] font-semibold text-guirose-marino active:bg-guirose-espuma"
                >
                  {sugerencia.texto}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {panel === "menu" && (
        <nav
          id={idMenu}
          aria-label="Principal"
          className="panel-movil max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain border-t border-guirose-borde bg-white px-4 pb-5 pt-1"
        >
          <ul>
            {enlaces.map((enlace) => (
              <li key={enlace.texto}>
                <a
                  href={enlace.href}
                  aria-current={esActual(enlace) ? "page" : undefined}
                  onClick={() => setPanel(null)}
                  className="flex min-h-14 items-center border-b border-guirose-borde text-[19px] font-semibold text-guirose-marino active:bg-guirose-espuma aria-[current=page]:font-bold aria-[current=page]:text-guirose-accion"
                >
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-guirose-texto">
            <p className="flex items-center gap-2">
              <ChatCircleTextIcon
                weight="fill"
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-guirose-accion"
              />
              Aseosría para tu embarcación
            </p>
            <p className="flex items-center gap-2">
              <MapPinIcon
                weight="fill"
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-guirose-accion"
              />
              Envíos a todo el Perú
            </p>
          </div>
        </nav>
      )}
    </div>
  );
}
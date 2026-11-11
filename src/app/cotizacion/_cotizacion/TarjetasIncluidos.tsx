"use client";

import { useEffect, useRef, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import type { Incluido } from "@/cotizacion/resolver";
import FotoAccesorio from "@/app/equipamiento/_equipamiento/FotoAccesorio";

type Props = { items: Incluido[] };

const flecha = "flex h-11 w-11 touch-manipulation select-none items-center justify-center rounded-full border-2 border-guirose-accion bg-white text-guirose-accion transition duration-150 ease-out active:scale-[0.95] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul disabled:border-[#C9D6E3] disabled:text-[#9FB3C8] disabled:active:scale-100";

// escritorio muestra todos los accesorios y el celular una fila para deslizar
export default function TarjetasIncluidos({ items }: Props) {
  const lista = useRef<HTMLUListElement>(null);
  const [vista, setVista] = useState({ alInicio: true, alFinal: false });

  const actualizar = () => {
    const el = lista.current;
    if (!el) return;
    setVista({
      alInicio: el.scrollLeft <= 2,
      alFinal: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  };

  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const observador = new ResizeObserver(actualizar);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const mover = (sentido: 1 | -1) => {
    const el = lista.current;
    if (!el) return;
    const sinMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: sentido * el.clientWidth,
      behavior: sinMovimiento ? "auto" : "smooth",
    });
  };

  return (
    <div>
      {/* vista celular */}
      <div className="mt-5 flex items-center justify-between gap-3 lg:hidden">
        <p className="text-[15px] font-semibold text-guirose-marino">
          Desliza para ver los {items.length} ítems
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label="Ver anteriores"
            disabled={vista.alInicio}
            onClick={() => mover(-1)}
            className={flecha}
          >
            <CaretLeftIcon
              aria-hidden="true"
              className="h-5 w-5"
              weight="bold"
            />
          </button>
          <button
            type="button"
            aria-label="Ver siguientes"
            disabled={vista.alFinal}
            onClick={() => mover(1)}
            className={flecha}
          >
            <CaretRightIcon
              aria-hidden="true"
              className="h-5 w-5"
              weight="bold"
            />
          </button>
        </div>
      </div>

      <ul
        ref={lista}
        onScroll={actualizar}
        className="mt-3 flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3 lg:mt-5 lg:grid lg:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] lg:gap-x-3.5 lg:gap-y-5 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-guirose-accion [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-guirose-espuma"
      >
        {items.map((d) => (
          <li key={d.clave} className="flex w-[140px] shrink-0 snap-start flex-col gap-2 lg:w-auto">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <div className="absolute inset-0">
                <FotoAccesorio foto={d.foto} className="h-full w-full rounded-xl bg-guirose-espuma" />
              </div>
            </div>
            <p className="min-h-[2.75rem] text-[15px] leading-snug font-semibold text-guirose-marino">
              {d.nombre}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
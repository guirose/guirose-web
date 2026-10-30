"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";

export default function Desplegable({
  titulo,
  numero,
  abiertoInicial = false,
  children,
}: {
  titulo: string;
  numero?: number;
  abiertoInicial?: boolean;
  children: ReactNode;
}) {
  const [abierto, setAbierto] = useState(abiertoInicial);
  const idPanel = useId();

  return (
    <div
      data-abierto={abierto}
      className="group rounded-[18px] border-[1.5px] border-transparent bg-guirose-espuma transition-[background-color,border-color,box-shadow] duration-[250ms] ease-out not-data-[abierto=true]:hover:bg-guirose-espuma-fuerte data-[abierto=true]:border-guirose-accion data-[abierto=true]:bg-white data-[abierto=true]:shadow-[0_16px_32px_-22px_rgba(0,105,217,0.6)]"
    >
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={idPanel}
        onClick={() => setAbierto(!abierto)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-[18px] px-5 py-5 text-left text-lg font-bold text-guirose-marino transition-colors duration-200 ease-out hover:text-guirose-accion focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-guirose-marino group-data-[abierto=true]:text-guirose-accion lg:px-7 lg:py-[22px] lg:text-[21px]"
      >
        <span className="flex items-center gap-4">
          {numero !== undefined && (
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-sm font-bold text-guirose-accion transition-colors duration-200 group-data-[abierto=true]:bg-guirose-accion group-data-[abierto=true]:text-white"
            >
              {String(numero).padStart(2, "0")}
            </span>
          )}
          {titulo}
        </span>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-guirose-accion transition-[rotate,background-color,color] duration-300 ease-[var(--ease-out)] group-data-[abierto=true]:rotate-180 group-data-[abierto=true]:bg-guirose-accion group-data-[abierto=true]:text-white"
        >
          <CaretDownIcon weight="bold" className="h-6 w-6" />
        </span>
      </button>

      <div
        id={idPanel}
        className="invisible grid grid-rows-[0fr] [transition:grid-template-rows_320ms_var(--ease-out),visibility_0s_320ms] group-data-[abierto=true]:visible group-data-[abierto=true]:grid-rows-[1fr] group-data-[abierto=true]:[transition:grid-template-rows_320ms_var(--ease-out),visibility_0s] motion-reduce:transition-none"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="-translate-y-2 px-5 pb-6 text-base leading-relaxed text-guirose-texto opacity-0 transition-[opacity,translate] duration-300 ease-[var(--ease-out)] group-data-[abierto=true]:translate-y-0 group-data-[abierto=true]:opacity-100 group-data-[abierto=true]:delay-75 lg:px-7 lg:text-lg">
            <div className={numero !== undefined ? "pl-12" : undefined}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

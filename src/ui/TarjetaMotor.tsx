import type { ReactNode } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

type PropsTarjetaMotor = {
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
  imagen: ReactNode;
};

export default function TarjetaMotor({
  titulo,
  descripcion,
  textoBoton,
  hrefBoton,
  imagen,
}: PropsTarjetaMotor) {
  return (
    <article className="relative flex min-h-[294px] flex-col rounded-md border border-guirose-borde bg-white px-[38px] pb-5 pt-6">
      <h3 className="text-xl font-bold">{titulo}</h3>

      <div className="flex flex-1 items-center">
        <p className="max-w-[290px] text-lg leading-[23px]">{descripcion}</p>
      </div>

      <a
        href={hrefBoton}
        className="flex h-[57px] w-[283px] items-center justify-center gap-2 rounded-md border border-guirose-marino text-xl font-semibold text-guirose-marino transition-colors hover:bg-guirose-marino hover:text-white"
      >
        {textoBoton}
        <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
      </a>

      {/* Foto del motor */}
      <div className="absolute right-[7px] top-[17px] h-[262px] w-[200px]">
        {imagen}
      </div>
    </article>
  );
}

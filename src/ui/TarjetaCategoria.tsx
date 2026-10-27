import type { ReactNode } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

type PropsTarjetaCategoria = {
  titulo: string;
  href: string;
  imagen: ReactNode;
};

export default function TarjetaCategoria({
  titulo,
  href,
  imagen,
}: PropsTarjetaCategoria) {
  return (
    <a
      href={href}
      className="group flex min-h-[258px] items-center gap-4 rounded-md border border-guirose-borde px-6 transition-colors hover:border-guirose-azul"
    >
      <div className="relative h-[200px] w-[170px] shrink-0">{imagen}</div>
      <div className="flex flex-1 items-center justify-between gap-3">
        <span className="text-2xl font-semibold uppercase text-guirose-marino">
          {titulo}
        </span>
        <ArrowRightIcon
          aria-hidden="true"
          className="h-6 w-6 shrink-0 text-guirose-azul transition-transform group-hover:translate-x-1"
        />
      </div>
    </a>
  );
}

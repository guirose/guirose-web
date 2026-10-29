import Buscador from "./Buscador";
import BotonCotizacion from "./BotonCotizacion";
import MenuPrincipal, { type EnlaceMenu } from "./MenuPrincipal";
import type { ReactNode } from "react";

type Sugerencia = { texto: string; href: string };

type PropsEncabezado = {
  enlaces: EnlaceMenu[];
  sugerencias: Sugerencia[];
  cantidadCotizacion: number;
  logo: ReactNode;
};

export default function Encabezado({
  enlaces,
  sugerencias,
  cantidadCotizacion,
  logo,
}: PropsEncabezado) {
  return (
    <header className="z-30 border-b border-guirose-borde bg-white lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-9 gap-y-3 px-6 py-3 lg:px-[88px]">
        {/* Logo */}
        <a
          href="/"
          aria-label="GUIROSE, inicio"
          className="flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          {logo}
        </a>

        <Buscador
          id="buscador"
          sugerencias={sugerencias}
          className="min-w-[260px] flex-1"
        />

        <BotonCotizacion cantidad={cantidadCotizacion} className="h-[50px]" />
      </div>

      {/* Franja celeste con el menú */}
      <div className="border-t border-guirose-espuma-fuerte bg-guirose-espuma">
        <div className="mx-auto max-w-[1440px] px-2.5 py-1.5 lg:px-[74px]">
          <MenuPrincipal enlaces={enlaces} />
        </div>
      </div>
    </header>
  );
}

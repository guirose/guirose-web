import Buscador from "./Buscador";
import BotonCotizacion from "./BotonCotizacion";
import MenuPrincipal, { type EnlaceMenu } from "./MenuPrincipal";

type Sugerencia = { texto: string; href: string };

type PropsEncabezado = {
  enlaces: EnlaceMenu[];
  sugerencias: Sugerencia[];
  cantidadCotizacion: number;
};

export default function Encabezado({
  enlaces,
  sugerencias,
  cantidadCotizacion,
}: PropsEncabezado) {
  return (
    <header className="z-30 border-b border-guirose-borde bg-white lg:sticky lg:top-0">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-9 gap-y-3 px-6 py-3.5 lg:px-[88px]">
        {/* Logo: texto provisional hasta tener el archivo */}
        <a
          href="/"
          className="text-4xl font-extrabold italic leading-none tracking-[0.06em] text-guirose-marino transition-opacity hover:opacity-80"
        >
          GUIROSE
        </a>

        <Buscador
          id="buscador"
          sugerencias={sugerencias}
          className="min-w-[260px] max-w-[640px] flex-1 lg:ml-auto"
        />

        <BotonCotizacion cantidad={cantidadCotizacion} className="h-[50px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-2.5 pb-2.5 lg:px-[74px]">
        <MenuPrincipal enlaces={enlaces} />
      </div>
    </header>
  );
}

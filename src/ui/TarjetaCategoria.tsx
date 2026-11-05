import type { ReactNode } from "react";

type PropsTarjetaCategoria = {
  titulo: string;
  descripcion: string;
  textoEnlace: string;
  href: string;
  imagen: ReactNode;
};

export default function TarjetaCategoria({
  titulo,
  descripcion,
  textoEnlace,
  href,
  imagen,
}: PropsTarjetaCategoria) {
  return (
    <a
      href={href}
      className="flex min-h-[170px] items-center gap-4 rounded-xl bg-guirose-espuma px-4 py-4 transition duration-200 ease-out hover:-translate-y-1 hover:bg-guirose-espuma-fuerte active:scale-[0.98] motion-reduce:hover:translate-y-0 xl:min-h-[240px] xl:gap-5 xl:px-6 xl:py-5"
    >
      <div className="relative h-[120px] w-[96px] shrink-0 mix-blend-multiply xl:h-[190px] xl:w-[150px]">
        {imagen}
      </div>
      <div className="min-w-0">
        <h3 className="text-[22px] font-bold leading-[1.2] text-guirose-marino xl:text-[26px]">
          {titulo}
        </h3>
        <p className="mt-1.5 text-[15px] text-guirose-texto xl:mt-2 xl:text-[17px]">
          {descripcion}
        </p>
        <span className="mt-2 inline-block text-[15px] font-semibold text-guirose-accion underline decoration-[1.5px] underline-offset-[6px] xl:mt-3 xl:text-base">
          {textoEnlace}
        </span>
      </div>
    </a>
  );
}

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
      className="flex min-h-[240px] items-center gap-5 ounded-xl bg-guirose-espuma px-6 py-5 transition duration-200 ease-out hover:-translate-y-1 hover:bg-guirose-espuma-fuerte active:scale-[0.98] motion-reduce:hover:translate-y-0"
    >
      <div className="relative h-[190px] w-[150px] shrink-0 mix-blend-multiply">
        {imagen}
      </div>
      <div className="min-2-0">
        <h3 className="text-[26px] font-bold leading-[1.2] text-guirose-marino">
          {titulo}
        </h3>
        <p className="mt-2 text-[17px] text-guirose-texto">{descripcion}</p>
        <span className="mt-3 inline-block text-base font-semibold text-guirose-accion underline decoration-[1.5px] underline-offset-[6px]">
          {textoEnlace}
        </span>
      </div>
    </a>
  );
}

import type { ReactNode } from "react";
import Boton from "./Boton";

type PropsTarjetaActividad = {
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
  imagen: ReactNode;
};

export default function TarjetaActividad({
  titulo,
  descripcion,
  textoBoton,
  hrefBoton,
  imagen,
}: PropsTarjetaActividad) {
  return (
    <article className="group flex h-full flex-col items-center text-center">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:aspect-[4/3]">
        <div className="absolute inset-0 transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
          {imagen}
        </div>
      </div>

      <h3 className="mt-6 text-[26px] font-bold leading-[1.15] tracking-[-0.015em] text-guirose-marino lg:text-[28px]">
        {titulo}
      </h3>
      <p className="mb-6 mt-2.5 max-w-[320px] text-[17px] text-guirose-texto lg:text-lg">
        {descripcion}
      </p>

      <Boton
        href={hrefBoton}
        variante="borde"
        className="mt-auto h-[52px] gap-3 px-7 text-lg font-semibold"
      >
        {textoBoton}
      </Boton>
    </article>
  );
}
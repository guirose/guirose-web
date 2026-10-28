import type { ReactNode } from "react";
import Boton from "./Boton";

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
    <article className="group flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-guirose-borde bg-white transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:flex-row">
      {/* Texto y botón */}
      <div className="flex flex-col py-9 pl-9 pr-7 sm:flex-[1_1_52%]">
        <h3 className="max-w-[200px] text-[32px] font-bold leading-[1.12] tracking-[-0.02em] text-guirose-marino">
          {titulo}
        </h3>
        <p className="mt-4 max-w-[260px] text-lg text-guirose-texto">
          {descripcion}
        </p>
        <Boton
          href={hrefBoton}
          variante="borde"
          className="mt-auto h-[52px] self-start px-[26px] text-lg font-semibold"
        >
          {textoBoton}
        </Boton>
      </div>

      {/* Panel celeste con la foto del motor */}
      <div className="flex items-end justify-center overflow-hidden bg-guirose-espuma px-4 py-6 sm:flex-[1_1_48%]">
        <div className="relative aspect-square h-full min-h-[360px] shrink-0 origin-bottom mix-blend-multiply transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
          {imagen}
        </div>
      </div>
    </article>
  );
}

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
    <article className="group relative flex min-h-[294px] flex-col rounded-md border border-guirose-borde bg-white px-[38px] pb-5 pt-6">
    <h3 className="text-xl font-bold">{titulo}</h3>
      <div className="flex flex-1 items-center">
        <p className="max-w-[290px] text-lg leading-[23px]">{descripcion}</p>
      </div>

      <Boton
        href={hrefBoton}
        variante="borde"
        className="h-[57px] w-[283px] justify-center gap-2 text-xl font-semibold"
      >
        {textoBoton}
      </Boton>

      {/* Foto del motor */}
      <div className="absolute right-[7px] top-[17px] h-[262px] w-[200px] origin-bottom transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
        {imagen}
      </div>
    </article>
  );
}

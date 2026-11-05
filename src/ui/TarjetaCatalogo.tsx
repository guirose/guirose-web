import type { CSSProperties, ReactNode } from "react";
import Boton from "./Boton";

type Props = {
  id: string;
  hp: number;
  linea: string;
  hrefFicha: string;
  imagen: ReactNode;
  indice?: number;
};

export default function TarjetaCatalogo({
  id,
  hp,
  linea,
  hrefFicha,
  imagen,
  indice = 0,
}: Props) {
  return (
    <article
      id={id}
      style={{ "--i": indice } as CSSProperties}
      className="tarjeta-catalogo group flex scroll-mt-40 flex-col"
    >
      {/* bloque foto y potencia */}
      <div className="tarjeta-caja overflow-hidden rounded-xl border border-guirose-borde bg-white transition-colors duration-200 ease-out group-hover:border-guirose-accion">
        <div className="relative aspect-square bg-guirose-espuma">
          <div className="absolute inset-3 origin-bottom mix-blend-multiply transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
            {imagen}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 px-3 pb-4 pt-3 text-center">
          <p className="text-[28px] font-extrabold leading-none text-guirose-marino lg:text-[32px]">
            {hp}
            <span className="ml-1 text-sm font-bold text-guirose-texto lg:text-base">
              HP
            </span>
          </p>
          <span className="rounded-full bg-guirose-espuma px-2.5 py-1 text-xs font-bold text-guirose-accion">
            {linea}
          </span>
        </div>
      </div>

      {/* Boton */}
      <Boton
        href={hrefFicha}
        variante="borde"
        className="mt-3 h-11 justify-center gap-2 text-[15px] font-semibold"
      >
        Ver detalles
      </Boton>
    </article>
  );
}
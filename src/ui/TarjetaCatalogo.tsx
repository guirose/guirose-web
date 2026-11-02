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
      className="tarjeta-catalogo group flex scroll-mt-40 flex-col overflow-hidden rounded-xl border border-guirose-borde bg-white"
    >
      {/* Panel con foto del motor */}
      <div className="relative aspect-square bg-guirose-espuma">
        <div className="absolute inset-3 origin-bottom mix-blend-multiply transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
          {imagen}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="text-3xl font-extrabold leading-none text-guirose-marino">
            {hp}
            <span className="m-1 text-base font-bold text-guirose-texto">
              HP
            </span>
          </p>
          <span className="rounded-full bg-guirose-espuma px-2.5 py-1 text-xs font-bold text-guirose-accion">
            {linea}
          </span>
        </div>

        <Boton
          href={hrefFicha}
          variante="borde"
          className="mt-auto h-11 justify-center gap-2 text-base font-semibold"
        >
          Ver ficha
        </Boton>
      </div>
    </article>
  );
}
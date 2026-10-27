import type { ReactNode } from "react";
import Boton from "./Boton";

type PropsBannerServicio = {
  titulo: string;
  lineas: string[];
  textoBoton: string;
  hrefBoton: string;
  imagen: ReactNode;
};

export default function BannerServicio({
  titulo,
  lineas,
  textoBoton,
  hrefBoton,
  imagen,
}: PropsBannerServicio) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-3 lg:px-[67px]">
      <div className="relative overflow-hidden rounded-lg bg-guirose-azul/10 text-guirose-marino lg:min-h-[343px]">
        <div className="relative h-56 lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[693px]">
          {imagen}
        </div>

        <div className="px-6 pb-8 pt-6 lg:pb-0 lg:pl-[682px] lg:pr-6 lg:pt-8">
          <h2 className="max-w-[500px] text-3xl font-bold leading-[1.2] lg:text-[38px]">
            {titulo}
          </h2>
          <div className="mt-6 h-[3px] w-56 bg-guirose-azul" />
          <p className="mt-6 text-lg lg:text-2xl lg:leading-[28px]">
            {lineas.map((linea) => (
              <span key={linea} className="block">
                {linea}
              </span>
            ))}
          </p>
          <Boton
            href={hrefBoton}
            variante="relleno"
            className="mt-7 h-[51px] w-fit gap-4 px-5 text-lg font-medium lg:text-xl"
          >
            {textoBoton}
          </Boton>
        </div>
      </div>
    </section>
  );
}

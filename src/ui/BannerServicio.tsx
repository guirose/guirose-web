import type { ReactNode } from "react";
import Boton from "./Boton";

type PropsBannerServicio = {
  id?: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
  imagen: ReactNode;
};

export default function BannerServicio({
  id,
  titulo,
  descripcion,
  textoBoton,
  hrefBoton,
  imagen,
}: PropsBannerServicio) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1440px] scroll-mt-38 px-6 pb-16 pt-3 lg:px-[67px] lg:pb-20"
    >
      <div className="relative overflow-hidden rounded-xl bg-guirose-azul/10 text-guirose-marino lg:flex lg:min-h-[343px] lg:items-center">
        <div className="relative h-56 lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[53%]">
          {imagen}
        </div>

        <div className="px-6 pb-8 pt-6 lg:py-10 lg:pl-[calc(53%+3.5rem)] lg:pr-10">
          <h2 className="max-w-[500px] text-3xl font-bold leading-[1.15] tracking-[-0.025em] lg:text-[40px]">
            {titulo}
          </h2>
          <div className="mt-5 h-[3px] w-56 bg-guirose-azul" />
          <p className="mt-5 max-w-[500px] text-lg text-guirose-texto lg:text-[22px] lg:leading-[1.4]">
            {descripcion}
          </p>
          <Boton
            href={hrefBoton}
            variante="relleno"
            className="mt-6 h-[52px] w-fit gap-4 px-6 text-lg font-medium lg:text-[19px]"
          >
            {textoBoton}
          </Boton>
        </div>
      </div>
    </section>
  );
}

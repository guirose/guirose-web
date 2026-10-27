import type { ReactNode } from "react";
import Boton from "./Boton";

type PropsBannerPromocion = {
  etiqueta: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
  fondo?: ReactNode;
};

export default function BannerPromocion({
  etiqueta,
  titulo,
  descripcion,
  textoBoton,
  hrefBoton,
  fondo,
}: PropsBannerPromocion) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-3 lg:px-[67px]">
      <div className="relative isolate overflow-hidden rounded-lg bg-guirose-marino text-white">
        {/* Foto de fondo */}
        <div className="absolute inset-0 -z-20">{fondo}</div>

        {/* Capa azul marino */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-guirose-marino from-40% to-transparent to-58%" />

        <div className="flex min-h-[385px] flex-col items-start px-6 pb-[42px] pt-[38px] lg:px-[39px]">
          <p className="rounded-md bg-guirose-rojo px-6 py-2 text-lg font-semibold uppercase leading-[22px]">
            {etiqueta}
          </p>

          <h2 className="mt-2.5 max-w-[520px] text-3xl font-bold uppercase leading-[1.3] lg:text-[38px] lg:leading-[49px]">
            {titulo}
          </h2>

          <p className="mt-3.5 max-w-[560px] text-lg lg:text-[22px] lg:leading-[30px]">
            {descripcion}
          </p>

          <Boton
            href={hrefBoton}
            variante="relleno"
            className="mt-[22px] h-[63px] gap-2 px-[26px] text-xl font-semibold lg:text-[22px]"
          >
            {textoBoton}
          </Boton>
        </div>
      </div>
    </section>
  );
}

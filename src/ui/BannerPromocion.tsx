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
    <section className="mx-auto max-w-[1440px] px-6 pb-3 pt-10 lg:px-[67px]">
      <div className="relative isolate overflow-hidden rounded-xl bg-guirose-marino text-white">
        {/* Foto de fondo */}
        <div className="absolute inset-0 -z-30">{fondo}</div>

        {/* Capa azul marino a la izquierda */}
        <div className="absolute inset-0 -z-20 bg-linear-to-r from-guirose-marino from-40% to-transparent to-65%" />

        {/* Curvas de nivel, muy suaves */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1306 420"
          preserveAspectRatio="none"
          className="absolute inset-0 -z-10 h-full w-full fill-none stroke-white stroke-[1.2]"
        >
          <path
            vectorEffect="non-scaling-stroke"
            opacity=".1"
            d="M0 80 C200 40 380 120 620 70 S980 30 1306 70"
          />
          <path
            vectorEffect="non-scaling-stroke"
            opacity=".08"
            d="M0 170 C220 130 420 220 660 160 S1000 120 1306 160"
          />
          <path
            vectorEffect="non-scaling-stroke"
            opacity=".07"
            d="M0 270 C240 230 460 320 700 260 S1020 220 1306 260"
          />
          <path
            vectorEffect="non-scaling-stroke"
            opacity=".06"
            d="M0 370 C260 330 500 420 740 360 S1040 320 1306 360"
          />
        </svg>

        <div className="flex min-h-[420px] flex-col items-start justify-center px-6 py-12 lg:px-[52px]">
          <p className="rounded-md bg-guirose-rojo px-5 py-2 text-lg font-semibold lg:text-[19px]">
            {etiqueta}
          </p>

          <h2 className="mt-5 max-w-[560px] text-4xl font-bold leading-[1.08] tracking-[-0.03em] lg:text-[52px]">
            {titulo}
          </h2>

          <p className="mt-4 max-w-[500px] text-lg lg:text-[21px] lg:leading-[1.45]">
            {descripcion}
          </p>

          <Boton
            href={hrefBoton}
            variante="relleno"
            className="mt-7 h-[58px] gap-3.5 px-7 text-xl font-semibold"
          >
            {textoBoton}
          </Boton>
        </div>
      </div>
    </section>
  );
}

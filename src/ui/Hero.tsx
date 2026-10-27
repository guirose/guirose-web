import type { ReactNode } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

type PropsHero = {
  etiqueta: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
  textoEnlace: string;
  hrefEnlace: string;
  fondo?: ReactNode;
};

export default function Hero({
  etiqueta,
  titulo,
  descripcion,
  textoBoton,
  hrefBoton,
  textoEnlace,
  hrefEnlace,
  fondo,
}: PropsHero) {
  return (
    <section className="relative isolate overflow-hidden bg-guirose-marino text-white">
      {/* Foto de fondo */}
      <div className="absolute inset-0 -z-20">{fondo}</div>

      {/* capa azul marino */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-guirose-marino/90 from-35% to-transparent to-60%" />

      <div className="mx-auto flex min-h-[567px] max-w-[1440px] flex-col items-start px-6 pb-10 pt-[73px] lg:px-[44px]">
        <p className="text-lg uppercase lg:text-2xl">{etiqueta}</p>
        <div className="mt-2 h-0.5 w-56 bg-guirose-azul" />

        <h1 className="mt-7 max-w-[640px] text-5xl font-semibold leading-[1.17] lg:text-[64px]">
          {titulo}
        </h1>

        <p className="mt-4 max-w-[470px] text-lg lg:text-2xl lg:leading-[33px]">
          {descripcion}
        </p>
        <a
          href={hrefBoton}
          className="mt-9 flex h-[60px] items-center gap-10 rounded-[5px] bg-guirose-azul px-6 text-xl font-medium transition-colors hover:bg-white hover:text-guirose-azul lg:text-2xl"
        >
          {textoBoton}
          <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
        </a>

        <a
          href={hrefEnlace}
          className="mt-7 text-xl font-medium underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-80"
        >
          {textoEnlace}
        </a>
      </div>
    </section>
  );
}

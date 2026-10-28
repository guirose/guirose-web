import type { ReactNode } from "react";
import Boton from "./Boton";

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
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-guirose-marino text-white">
      {/* Foto de fondo */}
      <div className="absolute inset-0 -z-20">{fondo}</div>

      {/* capa azul marino */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-guirose-marino via-guirose-marino/90 via-30% to-transparent to-60%" />

      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-[88px] lg:py-[72px]">
        <div className="entra [--retraso:100ms]">
          <p className="text-lg font-medium lg:text-[22px]">{etiqueta}</p>
          <div className="linea-dibuja mt-2.5 h-[3px] w-56 bg-guirose-azul" />
        </div>

        <h1 className="entra mt-7 max-w-[620px] text-5xl font-bold leading-[1.04] tracking-[-0.03em] [--retraso:200ms] lg:text-[72px]">
          {titulo}
        </h1>

        <p className="entra mt-6 max-w-[470px] text-lg [--retraso:300ms] lg:text-[23px] lg:leading-[1.45]">
          {descripcion}
        </p>

        <div className="entra mt-8 flex flex-col items-start gap-6 [--retraso:400ms]">
          <Boton
            href={hrefBoton}
            variante="relleno"
            className="h-[60px] gap-10 px-6 text-xl font-medium lg:text-2xl"
          >
            {textoBoton}
          </Boton>

          <a
            href={hrefEnlace}
            className="text-xl font-medium underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-80"
          >
            {textoEnlace}
          </a>
        </div>
      </div>
    </section>
  );
}

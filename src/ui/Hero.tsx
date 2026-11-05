import type { ReactNode } from "react";
import Boton from "./Boton";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

type PropsHero = {
  etiqueta?: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
  textoEnlace?: string;
  hrefEnlace?: string;
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
      <div className="absolute inset-0 -z-10 bg-guirose-marino/75 lg:bg-transparent lg:bg-linear-to-r lg:from-guirose-marino lg:via-guirose-marino/90 lg:via-30% lg:to-transparent lg:to-60%" />
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-[88px] lg:py-[72px]">
        <div className="entra [--retraso:100ms]">
          {etiqueta && (
            <p className="text-lg font-medium lg:text-[22px]">{etiqueta}</p>
          )}
          <div className="linea-dibuja h-[3px] w-56 bg-guirose-azul" />
        </div>

        <h1 className="entra mt-7 max-w-[660px] text-[40px] font-bold leading-[1.06] tracking-[-0.03em] [--retraso:200ms] sm:text-5xl lg:text-[64px]">
          {titulo}
        </h1>

        <p className="entra mt-6 max-w-[520px] text-lg [--retraso:300ms] lg:text-[22px] lg:leading-[1.45]">
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

          {textoEnlace && hrefEnlace && (
            <a
              href={hrefEnlace}
              className="inline-flex min-h-11 items-center gap-3 text-xl font-semibold transition-opacity hover:opacity-80"
            >
              {textoEnlace}
              <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

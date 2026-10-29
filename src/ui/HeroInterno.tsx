import type { ReactNode } from "react";

type Props = {
  titulo: string;
  descripcion: string;
  imagen: ReactNode;
};

// Forma de las olas
const RUTA_OLA =
  "M0 30 C120 6 240 6 360 30 S600 54 720 30 S960 6 1080 30 S1320 54 1440 30 S1560 6 1800 30 S2040 54 2160 30 S2400 6 2520 30 S2760 54 2880 30 L2880 80 L0 80 Z";

export default function HeroInterno({ titulo, descripcion, imagen }: Props) {
  return (
    <section className="relative h-[320px] overflow-hidden bg-[#082B4C] text-white sm:h-[360px]">
      {/* imagen */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 right-0 opacity-40 sm:left-[38%] sm:opacity-100 [-webkit-mask-image:linear-gradient(90deg,transparent,#000_45%)] [mask-image:linear-gradient(90deg,transparent,#000_45%)]"
      >
        {imagen}
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 pt-14 sm:pt-[76px] lg:px-[67px]">
        <h1 className="hero-entra max-w-[900px] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
          {titulo}
        </h1>
        <p className="hero-entra-2 mt-5 max-w-[500px] text-lg leading-normal text-[#C7D5E3] lg:text-xl">
          {descripcion}
        </p>
      </div>

      {/* olas */}
      <svg
        aria-hidden="true"
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
        className="ola-rapida absolute -bottom-0 left-0 h-20 w-[200%] fill-white opacity-30"
        style={{ bottom: 6 }}
      >
        <path d={RUTA_OLA} />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 2880 80"
        preserveAspectRatio="none"
        className="ola-lenta absolute left-0 h-20 w-[200%] fill-white"
        style={{ bottom: -2 }}
      >
        <path d={RUTA_OLA} />
      </svg>
    </section>
  );
}

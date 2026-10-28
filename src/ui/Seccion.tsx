import type { ReactNode } from "react";

type PropsSeccion = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

export default function Seccion({ titulo, subtitulo, children }: PropsSeccion) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[88px] lg:py-16">
      <h2 className="text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-guirose-marino lg:text-[44px]">
        {titulo}
      </h2>
      <div aria-hidden="true" className="mt-4 h-[3px] w-24 bg-guirose-azul" />
      {subtitulo && (
        <p className="mt-4 text-lg text-guirose-texto lg:text-xl">{subtitulo}</p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}

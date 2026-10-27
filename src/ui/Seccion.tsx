import type { ReactNode } from "react";

type PropsSeccion = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

export default function Seccion({ titulo, subtitulo, children }: PropsSeccion) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[67px]">
      <h2 className="text-3xl font-bold lg:text-[40px]">{titulo}</h2>
      {subtitulo && (
        <p className="mt-2 text-lg lg:text-2xl">{subtitulo}</p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}
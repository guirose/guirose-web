import type { ReactNode } from "react";

type PropsSeccion = {
  titulo: string;
  children: ReactNode;
};

export default function Seccion({ titulo, children }: PropsSeccion) {
  return (
    <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[67px]">
      <h2 className="text-exl font-bold lg:text-[40px] lg:leading-tight">
        {titulo}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}
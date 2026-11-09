import Image from "next/image";
import type { ReactNode } from "react";
import HeroInterno from "@/ui/HeroInterno";
import BarraMotores from "./_catalogo/BarraMotores";

export default function MotoresLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroInterno
        titulo="Motores Mercury"
        descripcion="Elige por potencia y revisa la ficha de cada motor"
        imagen={
          <Image
            src="/imagenes/banner-garantia.webp"
            alt=""
            fill
            sizes="(min-width: 640px) 62vw, 100vw"
            className="object-cover"
          />
        }
      />
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12 lg:px-[67px] lg:py-14">
        <BarraMotores />
        <div>{children}</div>
      </div>
    </>
  );
}